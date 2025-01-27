// Paytable
export const paytable = {
    'hv1': [10, 20, 50],
    'hv2': [5, 10, 20],
    'hv3': [5, 10, 15],
    'hv4': [5, 10, 15],
    'lv1': [2, 5, 10],
    'lv2': [1, 2, 5],
    'lv3': [1, 2, 3],
    'lv4': [1, 2, 3]
};

// Paylines
export const paylines = [
    [0, 1, 2, 3, 4],  // Payline 1
    [5, 6, 7, 8, 9],  // Payline 2
    [10, 11, 12, 13, 14],  // Payline 3
    [0, 6, 12, 8, 4],  // Payline 4
    [10, 6, 2, 8, 14],  // Payline 5
    [0, 6, 7, 8, 14],  // Payline 6
    [10, 6, 7, 8, 4]   // Payline 7
];

// Reel bands
export const reelBands = [
    ["hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"],
    ["hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"],
    ["lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4"],
    ["hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2"],
    ["lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4"]
];

// Current symbols on each reel, initialized with the specified values
export const currentSymbols = [
    ['hv2', 'lv3', 'lv3'],
    ['hv1', 'lv2', 'lv3'],
    ['lv1', 'hv2', 'lv3'],
    ['hv2', 'lv2', 'hv3'],
    ['lv3', 'lv4', 'hv2']
];