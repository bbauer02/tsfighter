
 # Version Actuelle sur la branche `main`.

clonez le projet puis : 
```
npm install
npm run dev
```
 
Compatible avec un PAD


 # Les Etapes : 
 # Partie 1 : Installation et Manipulation du canvas

Pour accéder au code source de l'étape 1 : 

```
git checkout step1
```
# Partie 2 : Modules, POO, Framing Timing

Pour accéder au code source de l'étape 1 :

```
git checkout step2-1
```

Nous allons dans un premier temps réorganiser notre code en "module JS" afin de séparer les éléments propre à Ken et ceux propres au Background.

Montrer le résultat : 

```
git checkout step2-2
```

Ensuite, nous allons ajouter le personnage de Ryu.

Montrer le résultat :

```
git checkout step2-3
```

Nous avons tout refactorisé au sein de classes pour utiliser de la POO

Montrer le résultat :

```
git checkout step2-4
```

Modification afin d'avoir la meme fluidité sur les écrans en 160 ou 60 ms de rafraichissement

Montrer le résultat :

```
git checkout step2-5
```

# Partie 3 : Animation

- Ajout de l'animation de Ken Avance et recule
- Ajout de l'animation de Ryu Avance et recule

```
git checkout step3
```

- Ajout d'un formulaire de contrôle des états des personnages

```
git checkout step4
```

- Ajout de l'état IDLE

```
git checkout step4-1
```

- Ajout de l'état JUMP-UP

```
git checkout step4-2
```

- Saut en avant et arriere
- Accroupie
- Limitation des qmouvements selon l'état de départ

```
git checkout step4-3
```

- Création de la class StreetFighterGame et refactorisation

```
git checkout step4-4
```

# Partie 4 : Clavier et GamePad Controls

- Ajouter un système de control
- Control au clavier
- Control au GamePad
- Control sur Mobile?
- Ajout d'ombre
- Réglages des transitions entre les états 

```
git checkout step5
```

```
git checkout step6
```


# Partie 5 : GESTION DES COLLISIONS


- Définition de la pushbox
- hitbox
- hurtbox
- throwbox

```
git checkout step7
```


# Partie 6 : Parallax Scrolling / Status HUD



```
git checkout step8
```

# Partie 7 : KICK / PUNCH
```
git checkout step9
```
Ajout du tracé des hitbox

```
git checkout kick
```

# Partie 8 : COLLISION ET DECOMPTE DES VIES
```
git checkout hitlife
```


## To DO 

* Stage

  * Systeme de caméra
  - Scrolling Parallax
  - Animation du background
  - Effet de 3D sur le sol
  - Collision d'objets du décor


* Fighter

    - Ajout d'ombre
    - Changement de direction
    - Collision/Poussée des boites
    - ajout d'un état LAND
    - ajout d'un état turn
    - ajout d'une hitbox
    - ajout de l'état Attack
    - ajout de l'état blocage
    - ajout de l'état blessure
    - ajout de l'état chute
    - ajout d'une boite de saisie ( lancé )
    - ajout de l'état "lance"
    - ajout de l'état success
    - ajout de l'état "dans les pommes"

* UI

    - Barre de vie
    - nom des combattants
    - compteur
    - barre de vie
    - décompte début du combat
    - décompte fin du combat
    - icones des victoires
    - score

* mouvement

  - Punch
  - Kick
  - air kick, air punch
  - crounch kick and punch
  - saisie
  - blocage
  - Hadoken
  - Tatsumaki
  - Shoruyken

* Mécaniques de jeu

    - Battle Start
    - Battle End
    - Battle Win
    - Battle Lose
    - Battle Draw
    - 

