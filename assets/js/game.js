window.addEventListener("DOMContentLoaded", function () {
  //Nombre de cases
  var cases = 9;
  //Nombre de cases que l'utilisateur a trouvé
  var casesCorrect;

  //Nombre de cases à trouver
  var nbrFind;

  //Solution
  var soluce;

  //Level du joueur
  var level;

  //Est-ce que le joueur a perdu
  var lose;

  //Vitesse coloration de la case du joueur
  var speedPlayer;

  //Vitesse coloration de la case de la solution
  var speedSoluce;

  //Empecher que l'utilisateur clique sur les cases lorsque la soluce se genere
  var loadingSoluce;

  //Ecouter les cliques sur les cases et retourner la valeur de case cliqué
  function casesListener() {
    for (const carre of document.querySelectorAll(".square")) {
      carre.addEventListener("click", () => {
        if (lose == false) {
          if (loadingSoluce == false) {
            colorCase(carre.getAttribute("data-case"), speedPlayer);
            verifSoluce(carre.getAttribute("data-case"));
          }
        } else if (lose == true) {
          document.querySelector("h1").innerHTML =
            "Tu dois d'abord recommencer";
        }
      });
    }
  }
  casesListener();

  //Génération d'un tableau qui va contenir les cases choisis pour le mémory
  function memoryGenerate(nbr) {
    var tabColor = [];
    for (let i = 0; i < nbr; i++) {
      if (tabColor != null) {
        let lastNumber = tabColor[i - 1];
        let randomNumber = Math.floor(Math.random() * cases);
        while (randomNumber == lastNumber) {
          randomNumber = Math.floor(Math.random() * cases);
        }
        tabColor.push(randomNumber);
      } else {
        tabColor.push(Math.floor(Math.random() * cases));
      }
    }
    return tabColor;
  }

  //Colorier la case pour indiquer laquelle le joueur doit cliquer
  function colorCase(nbr, speed) {
    let carre = document.querySelector(".square[data-case='" + nbr + "']")
      .style;
    let tempsMs = speed * 1000;
    carre.transition = "all " + speed + "s";
    carre.backgroundColor = "white";
    carre.opacity = 1;

    setTimeout(uncolorCase.bind(), tempsMs, nbr, speed);
  }
  //Enlever la couleur de la case
  function uncolorCase(nbr, speed) {
    let carre = document.querySelector(".square[data-case='" + nbr + "']")
      .style;
    carre.transition = "all " + speed + "s";
    carre.backgroundColor = "#000066";
    carre.opacity = 0.15;
  }
  //Montrer la solution
  function showSoluce(speed, soluce) {
    loadingSoluce = true;
    for (let i = 0; i < soluce.length; i++) {
      (function (i) {
        setTimeout(colorCase.bind(), speed * (i * 1000), soluce[i], speed);
      })(i);
      if (i == soluce.length - 1) {
        setTimeout(function () {
          loadingSoluce = false;
        }, speed * (soluce.length * 1000));
      }
    }
  }

  //Charger le prochain niveau
  function updateLevel() {
    nbrFind += 1;
    casesCorrect = 0;
    level += 1;
    soluce = memoryGenerate(nbrFind);
    speedSoluce *= 0.95;
    levelShow();
    showSoluce(speedSoluce, soluce);
  }

  //Vérifier que le joueur a cliqué sur la bonne case
  function verifSoluce(nbr) {
    if (nbr == soluce[casesCorrect]) {
      casesCorrect += 1;
      if (nbrFind == casesCorrect) {
        updateLevel();
      }
    } else {
      gameLose();
    }
  }

  //Mettre le jeu perdant lorsque le joueur se trompe de case
  function gameLose() {
    document.querySelector("h1").innerHTML =
      "Tu as perdu, clique sur recommencer";
    lose = true;
    document.querySelector(".game button").innerText = "Recommencer";
  }

  //Afficher le niveau du joueur
  function levelShow() {
    document.querySelector("h1").innerHTML = "Jeu du mémory - niveau: " + level;
  }
  //Commencer une partie
  function startGame() {
    casesCorrect = 0;

    nbrFind = 1;

    soluce = memoryGenerate(nbrFind);
    loadingSoluce = false;
    level = 1;
    lose = false;
    speedPlayer = 0.2;
    speedSoluce = 1;
    showSoluce(speedSoluce, soluce);
  }
  //Evenement sur le bouton pour lancer une partie
  document.querySelector(".game button").addEventListener("click", (e) => {
    if (document.querySelector(".game button").innerHTML == "Partie en cours") {
      e.preventDefault();
    } else {
      startGame();
      levelShow();
      document.querySelector(".game button").innerText = "Partie en cours";
    }
  });
});
