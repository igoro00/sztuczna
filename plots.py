import os
import re

from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

import generate_plot as gp

# Jeśli nie ma folderu stats, zakończ program
if not os.path.exists("stats"):
    print("Brak folderu stats")
    exit()

# Pobranie ścieżek plików z folderu puzzle
puzzleFiles = os.listdir("stats")

# Posortowanie plików według strategii (po tytule)
bfs_files = []
dfs_files = []
astr_files = []

for file in puzzleFiles:
    if re.search(r"bfs_[a-zA-Z]{4}_stats", file):
        bfs_files.append(file)
    elif re.search(r"dfs_[a-zA-Z]{4}_stats", file):
        dfs_files.append(file)
    elif re.search(r"astr_[a-zA-Z]{4}_stats", file):
        astr_files.append(file)

# Podział na listy ze względu na głębokość rozwiązania oraz permutacje/heurystyki
bfs_files_lvl_perm = {
    i: {
        perm: []
        for perm in ["drlu", "drul", "ludr", "lurd", "rdul", "rdlu", "ulrd", "uldr"]
    }
    for i in range(1, 8)
}
dfs_files_lvl_perm = {
    i: {
        perm: []
        for perm in ["drlu", "drul", "ludr", "lurd", "rdul", "rdlu", "ulrd", "uldr"]
    }
    for i in range(1, 8)
}
astr_files_lvl_perm = {i: {heur: [] for heur in ["manh", "hamm"]} for i in range(1, 8)}

# Podział plików na głębokości i permutacje / heurystyki
for file in bfs_files:
    for i in range(1, 8):
        if re.search(rf"_0{i}_", file):
            for perm in bfs_files_lvl_perm[i].keys():
                if perm in file:
                    bfs_files_lvl_perm[i][perm].append(file)

for file in dfs_files:
    for i in range(1, 8):
        if re.search(rf"_0{i}_", file):
            for perm in dfs_files_lvl_perm[i].keys():
                if perm in file:
                    dfs_files_lvl_perm[i][perm].append(file)

for file in astr_files:
    for i in range(1, 8):
        if re.search(rf"_0{i}_", file):
            for heur in astr_files_lvl_perm[i].keys():
                if heur in file:
                    astr_files_lvl_perm[i][heur].append(file)


# Podział na listy ze względu na głębokość rozwiązania
bfs_files_lvl = {i: [] for i in range(1, 8)}
dfs_files_lvl = {i: [] for i in range(1, 8)}
astr_files_lvl = {i: [] for i in range(1, 8)}

# Podział plików na głębokości
for file in bfs_files:
    for i in range(1, 8):
        if re.search(rf"_0{i}_", file):
            bfs_files_lvl[i].append(file)

for file in dfs_files:
    for i in range(1, 8):
        if re.search(rf"_0{i}_", file):
            dfs_files_lvl[i].append(file)

for file in astr_files:
    for i in range(1, 8):
        if re.search(rf"_0{i}_", file):
            astr_files_lvl[i].append(file)


# funkcja do obliczania sredniej wartosci z okreslonej linii pliku
def calculate_avg_value(files_list, line_number):
    avg_values = {}
    for key, files in files_list.items():
        total_sum = 0.0
        count = 0
        for file in files:
            with open(f"stats/{file}", "r") as f:
                lines = f.readlines()
                if len(lines) > line_number:
                    value = lines[line_number].strip()
                    if value != "-1":
                        total_sum += float(value)
                        count += 1
        avg_value = total_sum / count if count > 0 else -1
        avg_values[key] = avg_value
    return avg_values


# Obliczanie średniej długości rozwiązania (1 linia w pliku)

# Obliczanie średniej długości rozwiązania
all_avg_len_bfs = calculate_avg_value(bfs_files_lvl, 0)
all_avg_len_dfs = calculate_avg_value(dfs_files_lvl, 0)
all_avg_len_astr = calculate_avg_value(astr_files_lvl, 0)


avg_len_bfs = {i: calculate_avg_value(bfs_files_lvl_perm[i], 0) for i in range(1, 8)}
avg_len_dfs = {i: calculate_avg_value(dfs_files_lvl_perm[i], 0) for i in range(1, 8)}
avg_len_astr = {i: calculate_avg_value(astr_files_lvl_perm[i], 0) for i in range(1, 8)}


# Obliczanie średniej liczby odwiedzonych stanów
all_avg_states_bfs = calculate_avg_value(bfs_files_lvl, 1)
all_avg_states_dfs = calculate_avg_value(dfs_files_lvl, 1)
all_avg_states_astr = calculate_avg_value(astr_files_lvl, 1)
# Obliczanie średniej liczby odwiedzonych stanów (2 linia w pliku)
avg_states_bfs = {i: calculate_avg_value(bfs_files_lvl_perm[i], 1) for i in range(1, 8)}
avg_states_dfs = {i: calculate_avg_value(dfs_files_lvl_perm[i], 1) for i in range(1, 8)}
avg_states_astr = {
    i: calculate_avg_value(astr_files_lvl_perm[i], 1) for i in range(1, 8)
}


# Obliczanie średniej  liczba stanów przetworzonych (3 linia w pliku)
all_avg_proc_bfs = calculate_avg_value(bfs_files_lvl, 2)
all_avg_proc_dfs = calculate_avg_value(dfs_files_lvl, 2)
all_avg_proc_astr = calculate_avg_value(astr_files_lvl, 2)


avg_proc_bfs = {i: calculate_avg_value(bfs_files_lvl_perm[i], 2) for i in range(1, 8)}
avg_proc_dfs = {i: calculate_avg_value(dfs_files_lvl_perm[i], 2) for i in range(1, 8)}
avg_proc_astr = {i: calculate_avg_value(astr_files_lvl_perm[i], 2) for i in range(1, 8)}


# Obliczanie średniej   maksymalna osiągnięta głębokość rekursj (4 linia w pliku)
all_avg_max_depth_bfs = calculate_avg_value(bfs_files_lvl, 3)
all_avg_max_depth_dfs = calculate_avg_value(dfs_files_lvl, 3)
all_avg_max_depth_astr = calculate_avg_value(astr_files_lvl, 3)


avg_max_depth_bfs = {
    i: calculate_avg_value(bfs_files_lvl_perm[i], 3) for i in range(1, 8)
}
avg_max_depth_dfs = {
    i: calculate_avg_value(dfs_files_lvl_perm[i], 3) for i in range(1, 8)
}
avg_max_depth_astr = {
    i: calculate_avg_value(astr_files_lvl_perm[i], 3) for i in range(1, 8)
}


# Obliczanie średniej  zas trwania procesu obliczeniowego (5 linia w pliku)
all_avg_time_bfs = calculate_avg_value(bfs_files_lvl, 4)
all_avg_time_dfs = calculate_avg_value(dfs_files_lvl, 4)
all_avg_time_astr = calculate_avg_value(astr_files_lvl, 4)


avg_time_bfs = {i: calculate_avg_value(bfs_files_lvl_perm[i], 4) for i in range(1, 8)}
avg_time_dfs = {i: calculate_avg_value(dfs_files_lvl_perm[i], 4) for i in range(1, 8)}
avg_time_astr = {i: calculate_avg_value(astr_files_lvl_perm[i], 4) for i in range(1, 8)}


# Wyświetlanie wyników
print("Średnia długość rozwiązania:")
for depth in range(1, 8):
    print(f"Głębokość {depth}:")
    print(f"  BFS: {all_avg_len_bfs[depth]}")
    print(f"  DFS: {all_avg_len_dfs[depth]}")
    print(f"  A*: {all_avg_len_astr[depth]}")


# Wyświetlanie wyników
print("Średnia długość rozwiązania dla BFS:")
for depth, perm_lengths in avg_len_bfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_length in perm_lengths.items():
        print(f"  Permutacja {perm}: {avg_length}")

print("\nŚrednia długość rozwiązania dla DFS:")
for depth, perm_lengths in avg_len_dfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_length in perm_lengths.items():
        print(f"  Permutacja {perm}: {avg_length}")

print("\nŚrednia długość rozwiązania dla A*:")
for depth, heur_lengths in avg_len_astr.items():
    print(f"Głębokość {depth}:")
    for heur, avg_length in heur_lengths.items():
        print(f"  Heurystyka {heur}: {avg_length}")


print("\nŚrednia liczba odwiedzonych stanów:")
for depth in range(1, 8):
    print(f"Głębokość {depth}:")
    print(f"  BFS: {all_avg_states_bfs[depth]}")
    print(f"  DFS: {all_avg_states_dfs[depth]}")
    print(f"  A*: {all_avg_states_astr[depth]}")

print("\nŚrednia liczba odwiedzonych stanów dla BFS:")
for depth, perm_states in avg_states_bfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_states in perm_states.items():
        print(f"  Permutacja {perm}: {avg_states}")

print("\nŚrednia liczba odwiedzonych stanów dla DFS:")
for depth, perm_states in avg_states_dfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_states in perm_states.items():
        print(f"  Permutacja {perm}: {avg_states}")

print("\nŚrednia liczba odwiedzonych stanów dla A*:")
for depth, heur_states in avg_states_astr.items():
    print(f"Głębokość {depth}:")
    for heur, avg_states in heur_states.items():
        print(f"  Heurystyka {heur}: {avg_states}")


print("\nŚrednia liczba przetworzonych stanów:")
for depth in range(1, 8):
    print(f"Głębokość {depth}:")
    print(f"  BFS: {all_avg_proc_bfs[depth]}")
    print(f"  DFS: {all_avg_proc_dfs[depth]}")
    print(f"  A*: {all_avg_proc_astr[depth]}")

print("\nŚrednia liczba przetworzonych stanów dla BFS:")
for depth, perm_states in avg_proc_bfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_proc in perm_states.items():
        print(f"  Permutacja {perm}: {avg_proc}")

print("\nŚrednia liczba przetworzonych stanów dla DFS:")
for depth, perm_states in avg_proc_dfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_proc in perm_states.items():
        print(f"  Permutacja {perm}: {avg_proc}")

print("\nŚrednia liczba przetworzonych stanów dla A*:")
for depth, heur_states in avg_proc_astr.items():
    print(f"Głębokość {depth}:")
    for heur, avg_proc in heur_states.items():
        print(f"  Heurystyka {heur}: {avg_proc}")


print("\nŚrednia głębokosc rekursji:")
for depth in range(1, 8):
    print(f"Głębokość {depth}:")
    print(f"  BFS: {all_avg_max_depth_bfs[depth]}")
    print(f"  DFS: {all_avg_max_depth_dfs[depth]}")
    print(f"  A*: {all_avg_max_depth_astr[depth]}")

print("\nŚrednia głębokosc rekursji dla BFS:")
for depth, perm_states in avg_max_depth_bfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_max_depth in perm_states.items():
        print(f"  Permutacja {perm}: {avg_max_depth}")

print("\nŚrednia głębokosc rekursji dla DFS:")
for depth, perm_states in avg_max_depth_dfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_max_depth in perm_states.items():
        print(f"  Permutacja {perm}: {avg_max_depth}")

print("\nŚrednia głębokosc rekursji dla A*:")
for depth, heur_states in avg_max_depth_astr.items():
    print(f"Głębokość {depth}:")
    for heur, avg_max_depth in heur_states.items():
        print(f"  Heurystyka {heur}: {avg_max_depth}")


print("\nŚrednia głębokosc rekursji:")
for depth in range(1, 8):
    print(f"Głębokość {depth}:")
    print(f"  BFS: {all_avg_max_depth_bfs[depth]}")
    print(f"  DFS: {all_avg_max_depth_dfs[depth]}")
    print(f"  A*: {all_avg_max_depth_astr[depth]}")

print("\nŚrednia liczba przetworzonych stanów dla BFS:")
for depth, perm_states in avg_max_depth_bfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_max_depth in perm_states.items():
        print(f"  Permutacja {perm}: {avg_max_depth}")

print("\nŚrednia liczba przetworzonych stanów dla DFS:")
for depth, perm_states in avg_max_depth_dfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_max_depth in perm_states.items():
        print(f"  Permutacja {perm}: {avg_max_depth}")

print("\nŚrednia liczba przetworzonych stanów dla A*:")
for depth, heur_states in avg_max_depth_astr.items():
    print(f"Głębokość {depth}:")
    for heur, avg_max_depth in heur_states.items():
        print(f"  Heurystyka {heur}: {avg_max_depth}")


print("\nŚredni czas przetwarzania:")
for depth in range(1, 8):
    print(f"Głębokość {depth}:")
    print(f"  BFS: {all_avg_time_bfs[depth]}")
    print(f"  DFS: {all_avg_time_dfs[depth]}")
    print(f"  A*: {all_avg_time_astr[depth]}")

print("\nŚredni czas przetwarzania dla BFS:")
for depth, perm_states in avg_time_bfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_time in perm_states.items():
        print(f"  Permutacja {perm}: {avg_time}")

print("\nŚredni czas przetwarzania dla DFS:")
for depth, perm_states in avg_time_dfs.items():
    print(f"Głębokość {depth}:")
    for perm, avg_time in perm_states.items():
        print(f"  Permutacja {perm}: {avg_time}")

print("\nŚredni czas przetwarzania dla A*:")
for depth, heur_states in avg_time_astr.items():
    print(f"Głębokość {depth}:")
    for heur, avg_time in heur_states.items():
        print(f"  Heurystyka {heur}: {avg_time}")


gp.plot_all_strategies(
    all_avg_len_bfs,
    all_avg_len_dfs,
    all_avg_len_astr,
    "Średnia długość rozwiązania",
    "Głębokość",
    "Średnia długość rozwiązania",
)
gp.plot_permutations(
    avg_len_bfs,
    "Średnia długość rozwiązania dla BFS",
    "Głębokość rozwiązania",
    "Średnia długość rozwiązania",
)
gp.plot_permutations(
    avg_len_dfs,
    "Średnia długość rozwiązania dla DFS",
    "Głębokość rozwiązania",
    "Średnia długość rozwiązania",
)
gp.plot_permutations(
    avg_len_astr,
    "Średnia długość rozwiązania dla A*",
    "Głębokość rozwiązania",
    "Średnia długość rozwiązania",
)


gp.plot_all_strategies(
    all_avg_states_bfs,
    all_avg_states_dfs,
    all_avg_states_astr,
    "Średnia liczba odwiedzonych stanów dla wszystkich strategii",
    "Głębokość rozwiązania",
    "Średnia liczba odwiedzonych stanów",
    True
)
gp.plot_permutations(
    avg_states_bfs,
    "Średnia liczba odwiedzonych stanów dla BFS",
    "Głębokość rozwiązania",
    "Średnia liczba odwiedzonych stanów",
    False #????
)
gp.plot_permutations(
    avg_states_dfs,
    "Średnia liczba odwiedzonych stanów dla DFS",
    "Głębokość rozwiązania",
    "Średnia liczba odwiedzonych stanów",
    True #????
)
gp.plot_permutations(
    avg_states_astr,
    "Średnia liczba odwiedzonych stanów dla A*",
    "Głębokość rozwiązania",
    "Średnia liczba odwiedzonych stanów",
)


gp.plot_all_strategies(
    all_avg_proc_bfs,
    all_avg_proc_dfs,
    all_avg_proc_astr,
    "Średnia liczba przeprocesowanych stanów dla wszystkich strategii",
    "Głębokość rozwiązania",
    "Średnia liczba przeprocesowanych stanów",
    True
)
gp.plot_permutations(
    avg_proc_bfs,
    "Średnia liczba przeprocesowanych stanów dla BFS",
    "Głębokość rozwiązania",
    "Średnia liczba przeprocesowanych stanów",
    False #????
)
gp.plot_permutations(
    avg_proc_dfs,
    "Średnia liczba przeprocesowanych stanów dla DFS",
    "Głębokość rozwiązania",
    "Średnia liczba przeprocesowanych stanów",
    True, #????
)
gp.plot_permutations(
    avg_proc_astr,
    "Średnia liczba przeprocesowanych stanów dla A*",
    "Głębokość rozwiązania",
    "Średnia liczba przeprocesowanych stanów",
)


gp.plot_all_strategies(
    all_avg_max_depth_bfs,
    all_avg_max_depth_dfs,
    all_avg_max_depth_astr,
    "Średnia maksymalna rekursja dla wszystkich strategii",
    "Głębokość rozwiązania",
    "Średnia maksymalna rekursja",
)
gp.plot_permutations(
    avg_max_depth_bfs,
    "Średnia maksymalna rekursja dla BFS",
    "Głębokość rozwiązania",
    "Średnia maksymalna rekursja",
)
gp.plot_permutations(
    avg_max_depth_dfs,
    "Średnia maksymalna rekursja dla DFS",
    "Głębokość rozwiązania",
    "Średnia maksymalna rekursja",
)
gp.plot_permutations(
    avg_max_depth_astr,
    "Średnia maksymalna rekursja dla A*",
    "Głębokość rozwiązania",
    "Średnia maksymalna rekursja",
)


gp.plot_all_strategies(
    all_avg_time_bfs,
    all_avg_time_dfs,
    all_avg_time_astr,
    "Średni czas przetwarzania dla wszystkich strategii",
    "Głębokość rozwiązania",
    "Średni czas przetwarzania [ms]",
    True
)
gp.plot_permutations(
    avg_time_bfs,
    "Średni czas przetwarzania dla BFS",
    "Głębokość rozwiązania",
    "Średni czas przetwarzania [ms]",
    False
)
gp.plot_permutations(
    avg_time_dfs,
    "Średni czas przetwarzania dla DFS",
    "Głębokość rozwiązania",
    "Średni czas przetwarzania [ms]",
    True
)
gp.plot_permutations(
    avg_time_astr,
    "Średni czas przetwarzania dla A*",
    "Głębokość rozwiązania",
    "Średni czas przetwarzania [ms]",
)
