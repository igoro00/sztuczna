keyboard_layout = {
    
    # Row 2 (QWERTY row)
    'q': (1, 0.5), 'w': (1, 1.5), 'e': (1, 2.5), 'r': (1, 3.5), 't': (1, 4.5),
    'y': (1, 5.5), 'u': (1, 6.5), 'i': (1, 7.5), 'o': (1, 8.5), 'p': (1, 9.5),
    
    # Row 3 (ASDF row)
    'a': (2, 0.75), 's': (2, 1.75), 'd': (2, 2.75), 'f': (2, 3.75), 'g': (2, 4.75),
    'h': (2, 5.75), 'j': (2, 6.75), 'k': (2, 7.75), 'l': (2, 8.75),
    
    # Row 4 (ZXCV row)
    'z': (3, 1.25), 'x': (3, 2.25), 'c': (3, 3.25), 'v': (3, 4.25), 'b': (3, 5.25),
    'n': (3, 6.25), 'm': (3, 7.25)
}

def dist(c1:str, c2:str) -> float:
    if c1 not in keyboard_layout or c2 not in keyboard_layout:
        raise ValueError(f"Both characters must be valid keys on the QWERTY keyboard. Got '{c1}' and '{c2}'.")
    
    x1, y1 = keyboard_layout[c1]
    x2, y2 = keyboard_layout[c2]
    
    return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5


def get_max_dist():
    max_distance = 0.0
    keys = list(keyboard_layout.keys())
    
    for i in range(len(keys)):
        for j in range(i + 1, len(keys)):
            d = dist(keys[i], keys[j])
            if d > max_distance:
                max_distance = d
                
    return max_distance

# calculated from get_max_dist()
max_dist = 9
