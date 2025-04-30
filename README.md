# COMMITOWANIE

PRZED KAŻDYM COMMITEM URUCHOM TĄ KOMENDĘ!

```sh
./clear_nb.sh
```

Ta komenda czyści outputy jupyter notebooka zeby nie commitować ogromnych plików.

Jeśli zapomniałeś ale jeszcze nie spushowałeś to możesz po prostu zrobić `git commit --amend ` itd (w vscode zamiast commit to ↓ i potem "Commit (Amend)")

Jeśli scommitowałeś i spushowałeś, ale sie od razu zorientowałeś (i nie pojawił sie nowy commit na githubie w miedzy czasie) to commit amend (to samo co wyżej) a potem `git push --force`