export interface UserLocation {
  city: string;
  state: string;
  pincode: string;
  formatted: string;
  isMainLocation?: boolean;
}

export const MAIN_LOCATION: UserLocation = {
  city: 'Belagavi',
  state: 'Karnataka',
  pincode: '590001',
  formatted: 'Belagavi, Karnataka (590001)',
  isMainLocation: true,
};

export const MAJOR_CITIES: UserLocation[] = [
  MAIN_LOCATION,
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    formatted: 'Bengaluru, Karnataka (560001)',
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    formatted: 'Mumbai, Maharashtra (400001)',
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110001',
    formatted: 'Delhi NCR (110001)',
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    formatted: 'Ahmedabad, Gujarat (380001)',
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    formatted: 'Chennai, Tamil Nadu (600001)',
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    formatted: 'Hyderabad, Telangana (500001)',
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700001',
    formatted: 'Kolkata, West Bengal (700001)',
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    formatted: 'Pune, Maharashtra (411001)',
  },
  {
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395003',
    formatted: 'Surat, Gujarat (395003)',
  },
  {
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492001',
    formatted: 'Raipur, Chhattisgarh (492001)',
  },
  {
    city: 'Mandi Gobindgarh',
    state: 'Punjab',
    pincode: '147301',
    formatted: 'Mandi Gobindgarh, Punjab (147301)',
  },
];

const STORAGE_KEY = 'bable_user_location';

export const getStoredLocation = (): UserLocation => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.formatted) {
        return parsed;
      }
    }
  } catch {
    // Fallback on error
  }
  return MAIN_LOCATION;
};

export const saveStoredLocation = (location: UserLocation): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    // Dispatch custom event so all open components sync immediately
    window.dispatchEvent(new CustomEvent('bable_location_changed', { detail: location }));
  } catch (e) {
    console.error('Error saving location:', e);
  }
};

// PIN Code Detection Helper
export const detectLocationFromPincode = async (
  input: string
): Promise<{ location: UserLocation; detectedName: string } | null> => {
  const cleanInput = input.trim();
  
  // 1. Check if input matches 6-digit PIN code format
  const isPincode = /^[1-9][0-9]{5}$/.test(cleanInput);

  if (isPincode) {
    // Fast local prefix map for common Indian industrial hubs
    const prefix = cleanInput.substring(0, 2);
    let estimatedCity = '';
    let estimatedState = '';

    if (cleanInput.startsWith('590') || cleanInput.startsWith('591')) {
      estimatedCity = 'Belagavi';
      estimatedState = 'Karnataka';
    } else if (prefix === '56') {
      estimatedCity = 'Bengaluru';
      estimatedState = 'Karnataka';
    } else if (prefix === '58') {
      estimatedCity = 'Hubballi-Dharwad';
      estimatedState = 'Karnataka';
    } else if (prefix === '57') {
      estimatedCity = 'Mysuru';
      estimatedState = 'Karnataka';
    } else if (prefix === '40') {
      estimatedCity = 'Mumbai';
      estimatedState = 'Maharashtra';
    } else if (prefix === '41') {
      estimatedCity = 'Pune';
      estimatedState = 'Maharashtra';
    } else if (prefix === '11') {
      estimatedCity = 'New Delhi';
      estimatedState = 'Delhi';
    } else if (prefix === '12') {
      estimatedCity = 'Gurugram';
      estimatedState = 'Haryana';
    } else if (prefix === '20') {
      estimatedCity = 'Noida / Ghaziabad';
      estimatedState = 'Uttar Pradesh';
    } else if (prefix === '38') {
      estimatedCity = 'Ahmedabad';
      estimatedState = 'Gujarat';
    } else if (prefix === '39') {
      estimatedCity = 'Surat';
      estimatedState = 'Gujarat';
    } else if (prefix === '60') {
      estimatedCity = 'Chennai';
      estimatedState = 'Tamil Nadu';
    } else if (prefix === '70') {
      estimatedCity = 'Kolkata';
      estimatedState = 'West Bengal';
    } else if (prefix === '50') {
      estimatedCity = 'Hyderabad';
      estimatedState = 'Telangana';
    } else if (prefix === '49') {
      estimatedCity = 'Raipur';
      estimatedState = 'Chhattisgarh';
    } else if (prefix === '14') {
      estimatedCity = 'Mandi Gobindgarh / Ludhiana';
      estimatedState = 'Punjab';
    } else if (prefix === '30') {
      estimatedCity = 'Jaipur';
      estimatedState = 'Rajasthan';
    } else if (prefix === '45') {
      estimatedCity = 'Indore';
      estimatedState = 'Madhya Pradesh';
    } else if (prefix === '40') {
      estimatedCity = 'Goa / Konkan';
      estimatedState = 'Goa';
    }

    // Try fetching from India Post API for exact post office details
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${cleanInput}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const district = po.District || po.Name;
          const state = po.State;
          const locObj: UserLocation = {
            city: district,
            state: state,
            pincode: cleanInput,
            formatted: `${district}, ${state} (${cleanInput})`,
          };
          return { location: locObj, detectedName: `${district}, ${state} (${cleanInput})` };
        }
      }
    } catch {
      // API lookup network error/offline fallback below
    }

    if (estimatedCity && estimatedState) {
      const locObj: UserLocation = {
        city: estimatedCity,
        state: estimatedState,
        pincode: cleanInput,
        formatted: `${estimatedCity}, ${estimatedState} (${cleanInput})`,
      };
      return { location: locObj, detectedName: `${estimatedCity}, ${estimatedState} (${cleanInput})` };
    }

    // Generic fallback for valid PIN code
    const genericLoc: UserLocation = {
      city: `PIN ${cleanInput}`,
      state: 'India',
      pincode: cleanInput,
      formatted: `PIN Code ${cleanInput}`,
    };
    return { location: genericLoc, detectedName: `PIN Code ${cleanInput}` };
  }

  // 2. If user typed city/location text manually (e.g. "Goa" or "Bellary")
  if (cleanInput.length >= 2) {
    const customLoc: UserLocation = {
      city: cleanInput,
      state: 'India',
      pincode: '',
      formatted: cleanInput,
    };
    return { location: customLoc, detectedName: cleanInput };
  }

  return null;
};
