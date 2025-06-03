import random
import string

def generate_random(c: int):

    # Generate a random string of length c
    return ''.join(random.choices(string.ascii_letters, k=c)).lower()