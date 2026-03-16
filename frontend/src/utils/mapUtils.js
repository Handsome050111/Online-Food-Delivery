export const cityCoordinates = {
    'Islamabad': [33.6844, 73.0479],
    'Karachi': [24.8607, 67.0011],
    'Lahore': [31.5204, 74.3587],
    'Peshawar': [34.0151, 71.5249],
    'Rawalpindi': [33.5651, 73.0169],
    'Faisalabad': [31.4504, 73.1350],
    'Multan': [30.1575, 71.4578],
    'Quetta': [30.1798, 66.9750],
    'Sialkot': [32.4945, 74.5229],
    'Gujranwala': [32.1877, 74.1945]
};

export const getCityCoordinates = (city) => {
    return cityCoordinates[city] || cityCoordinates['Islamabad'];
};
