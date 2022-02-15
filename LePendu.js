Hall_of_Fame = new Array(); // == HOF | tableau contentant les pseudo des joueurs, les mots secrest trouvs, le nombre d'erreur(s) commis et le temps mis pour trouver le mot
var bonneLettre = new Array(); //tableau contenant le mot secret, et apparaissant  au dessus des images du pendu
var mauvaiseLettre = new Array(); //tableau contentant les lettres n'étant pas dans le mot secret, apparissant au dessous des images du pendu
var alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
var rank = 0;//joue sur l'affichage du tableau lorsque la page web est lancée ou rafraichit

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// PRESENTATION DES FONCTIONS
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Affiche/cache le tableau HOF en enclenchant le bouton RANKING
 */
function ranking() {
  rank++;
  if (rank % 2 != 0) {
    showDisplay(tableauHOF);
  } else {
    hideDisplay(tableauHOF);
  }
}

/**
 * Démarre une partie du pendu lorsque le bouton START est enclenché
 */
function go() {
  hideDisplay(boutonClick); 
  hideDisplay(champPseudo); 
  showDisplay(pendu); 
  hideDisplay(tableauHOF);
  reussiteTentative = 0; //re-initialisation 
  erreurTentative = 0; //re-initialisation 
  rank = 0; //re-initilisation
  penduApparition(erreurTentative); 
  $(inputLettre).attr("placeholder", "Entrez une lettre");
  alertBlank(resultat); 
  alertBlank(HOFRate); 
  timeStart = timeNow();
  timerAffichage();
  testMot();
}

/**
 * Cache la DIV contenant une image, un input, un tableau ou un bouton
 * @param {*} infoADonner
 */
function hideDisplay(infoADonner) {
  $(infoADonner).css("display", "none");
}

/**
 * Affiche la DIV contenant une image, un input, un tableau ou un bouton
 * @param {*} infoADonner
 */
function showDisplay(infoADonner) {
  $(infoADonner).css("display", "block");
}

/**
 * Affiche une image du pendu selon l'étape au cours de la partie (en fonction du nombre d'erreur(s))
 * @param {*} valeurErreur
 */
function penduApparition(valeurErreur) {
  $(hang)
    .attr("src", "./Hangman-" + valeurErreur + ".png")
    .css("display", "block");
  //références pour les images "Hangman-" 1 à 10 compris (capture des images réalisées) https://www.youtube.com/watch?v=ykt7RNXBDIM ||
  //référence pour le dernier Hangman https://www.123rf.com/stock-photo/hanged_man.html?sti=n8ybjz6mbzrdb4ifpx ||
  //référence pour le premier Hangman https://nymag.com/intelligencer/2020/01/speedrunner-pranks-stream-with-skyrim-meme.html
}

/**
 * Cache un message text
 * @param {*} infoADonner
 */
function alertBlank(infoADonner) {
  $(infoADonner).text("");
}

/**
 * Démarrage du timer
 * @returns
 */
function timeNow() {
  return new Date();
}

/**
 * Affiche le timer
 */
function timerAffichage() {
  interval = setInterval(function () {
    let dateAffichage = new Date();
    timerElement = $(timer);
    timerElement.text(
      Number.parseFloat(
        (dateAffichage.getTime() - timeStart.getTime()) / 1000
      ).toFixed(3) + "s"
    );
  }, 50); //mise à jour toutes les 50 millisecondes
}

/**
 * Choix du mot secret par l'ordinateur et saisit d'une lettre par le joueur
 */
function testMot() {
  motOrdi = words[Math.floor(Math.random() * 387) + 1];
  tableauMotOrdi = motOrdi.split("");
  console.log(tableauMotOrdi);
  showDisplay(champLettre); 
  tailleMot();
  var promptLettre = document.getElementById("inputLettre");
  promptLettre.onchange = function (event) {
    lettreUtilisateur = this.value; 
    this.value = "";
    lettreON();
  };
}

/**
 * Affiche le nombres de lettres correspondant au mot secret choisit par l'ordi (sous la forme d'underscore)
 */
function tailleMot() {
  for (var pos = 0; pos < tableauMotOrdi.length; pos++) {
    if (tableauMotOrdi[pos] == "-") {
      bonneLettre[pos] = "     -     ";
      reussiteTentative++;
    } else {
      bonneLettre[pos] = "     _     ";
    }
  }
  apparitionTableauLettre(apparitionMot, bonneLettre); 
}

/**
 * Affiche une DIV contenant un tableau (celui avec le mot secret ou celui contenant les lettres n'apparaissant pas dans le mot secret)
 * @param {*} infoADonner
 * @param {*} tableauADonner
 */
function apparitionTableauLettre(infoADonner, tableauADonner) {
  $(infoADonner).html(tableauADonner).css("fontSize", "50px");
}

/**
 * Trie si la lettre saisit par le joueur a déjà été proposé, ou est présent/absent du mot secret. Permet aussi de trier le cas ou plusieurs lettres/autre chose qu'une lettre est saisit
 */
function lettreON() {
  var lettreDejaPresente = 0; //reset || vérifie si la lettre saisit à déjà été proposée ou non
  var plusieursLettres = 0; //reset || verifie si plusieurs/autre chose qu'une lettre à été proposé
  var lettrePresente = 0; //reset || vérifie si la lettre saisit est présente dans le mot secret
  for (var pos = 0; pos < bonneLettre.length; pos++) {
    if (" " + lettreUtilisateur.toUpperCase() + " " == bonneLettre[pos]) {
      //cas ou la lettre proposée est déjà présente dans le tableau comprenant le mot secret
      erreurTentative++;
      lettreDejaPresente++;
      $(inputLettre).attr("placeholder", "Lettre déja proposée");
      break;
    }
  }
  for (var pos = 0; pos < tableauMotOrdi.length; pos++) {
    if (
      lettreUtilisateur.toUpperCase() == tableauMotOrdi[pos] &&
      lettreDejaPresente == 0
    ) {
      //cas ou la lettre proposée est présente dans le mot secret et n'a pas déjà été proposée avant
      reussiteTentative++;
      lettrePresente++;
      bonneLettre[pos] = " " + tableauMotOrdi[pos] + " ";
      $(inputLettre).attr("placeholder", "Lettre présente");
      apparitionTableauLettre(apparitionMot, bonneLettre); 
    }
  }
  for (var pos = 0; pos < alphabet.length; pos++) {
    if (lettreUtilisateur.toUpperCase() == alphabet[pos]) {
      //cas ou le joueur insère plusieurs lettres ou autre chose qu'une lettre
      plusieursLettres++;
    }
  }
  if (plusieursLettres == 0) {
    erreurTentative++;
    $(inputLettre).attr("placeholder", "Seulement UNE lettre");
  } else if (lettrePresente == 0 && lettreDejaPresente == 0) {
    //cas ou la lettre proposée n'apparait pas dans le mot secret et n'a pas déjà été proposée
    erreurTentative++;
    verifMauvaiseLettre();
    apparitionTableauLettre(tableauMauvaisesLettres, mauvaiseLettre); 
  }
  penduApparition(erreurTentative); 
  partieGagneeOuPerdue(erreurTentative, reussiteTentative);
}

/**
 * Vérifie si la lettre saisit par le joueur figure déjà ou non dans le tableau comprenant les lettres qui ne sont pas dans le mot secret
 */
function verifMauvaiseLettre() {
  var verifLettreUtilisee = 0;
  if (mauvaiseLettre.length == 0) {
    //cas ou le tableau est vide
    mauvaiseLettre.push("     " + lettreUtilisateur.toUpperCase() + "     ");
    $(inputLettre).attr("placeholder", "Lettre absente");
  } else {
    //cas ou le tableau n'est pas vide
    for (var pos = 0; pos < mauvaiseLettre.length; pos++) {
      if (
        "     " + lettreUtilisateur.toUpperCase() + "     " ==
        mauvaiseLettre[pos]
      ) {
        verifLettreUtilisee++;
        $(inputLettre).attr("placeholder", "Lettre déja proposée");
      }
    }
    if (verifLettreUtilisee == 0) {
      mauvaiseLettre.push("     " + lettreUtilisateur.toUpperCase() + "     ");
      $(inputLettre).attr("placeholder", "Lettre absente");
    }
  }
}

/**
 * Active toutes les fonctions relatives à la partie gagnée ou perdue par le joueur
 * @param {*} valeurErreur
 * @param {*} valeurReussite
 * @returns
 */
function partieGagneeOuPerdue(valeurErreur, valeurReussite) {
  if (valeurErreur == 10) {//limite du dessin du pendu avant défaite
    //cas ou le joueur perd
    alertMotPerdu(motOrdi);
    hideDisplay(champLettre); 
    alertBlank(tableauMauvaisesLettres); 
    mauvaiseLettre.length = 0; //reset
    bonneLettre.length = 0; //reset
    alertBlank(apparitionMot); 
    showDisplay(boutonClick); 
    return 0;
  } else if (valeurReussite == tableauMotOrdi.length) {
    //cas ou le joueur gagne
    hideDisplay(champLettre);
    timeEnd = timeNow(); 
    time = (timeEnd - timeStart) / 1000.0; //calcule le temps mis au joueur pour trouver le mot secret
    alertResultat(erreurTentative, time);
    alertBlank(tableauMauvaisesLettres);
    mauvaiseLettre.length = 0;
    bonneLettre.length = 0;
    HOFInferieureOuSuperieure10();
    return 0;
  }
}

/**
 * Annonce que le joueur a perdu la partie et affiche le mot secret
 * @param {*} motChoisitParOrdi
 */
function alertMotPerdu(motChoisitParOrdi) {
  $(resultat)
    .text("PERDU ! Le mot secret était " + "'" + motChoisitParOrdi + "'")
    .css({ fontSize: "30px", color: "rgb(156, 19, 19)" });
}

/**
 * Annonce que le joueur à gagné la partie et affiche le nombre d'erreur(s) + temps
 * @param {*} valeurErreur
 * @param {*} valeurDuTemps
 */
function alertResultat(valeurErreur, valeurDuTemps) {
  if (valeurErreur == 0) {
    $(resultat)
      .text(
        "BRAVO ! Le mot secret a été trouvé en ne commettant aucune erreur en " +
          valeurDuTemps +
          " secondes"
      )
      .css({ fontSize: "30px", color: "rgb(11, 97, 14)" });
  } else if (valeurErreur == 1) {
    $(resultat)
      .text(
        "BRAVO ! Le mot secret a été trouvé en commettant seulement " +
          valeurErreur +
          " erreur en " +
          valeurDuTemps +
          " secondes"
      )
      .css({ fontSize: "30px", color: "rgb(11, 97, 14)" });
  } else if (valeurErreur > 1) {
    $(resultat)
      .text(
        "BRAVO ! Le mot secret a été trouvé en commettant " +
          valeurErreur +
          " erreurs en " +
          valeurDuTemps +
          " secondes"
      )
      .css({ fontSize: "30px", color: "rgb(11, 97, 14)" });
  }
}

/**
 *Condition pour l'enregistrement de nouveaux joueurs en fonction de la taille du tableau HOF
 */
function HOFInferieureOuSuperieure10() {
  if (Hall_of_Fame.length < 10) {
    //pas de condition
    alertResultat(erreurTentative, time);
    showWinningOuLoosing("Winning"); //référence (capture) https://www.shutterstock.com/fr/image-photo/dynamic-handsome-young-man-thumbs-laughing-501537007
    remplirTableau();
  } else {
    // condition en fonction du nombre d'erreurs et/ou du temps
    if (
      erreurTentative < Hall_of_Fame[Hall_of_Fame.length - 1].erreurTentative || //cas ou le joueur peut entrer
      (erreurTentative ==
        Hall_of_Fame[Hall_of_Fame.length - 1].erreurTentative &&
        time <= Hall_of_Fame[Hall_of_Fame.length - 1].time)
    ) {
      alertResultat(erreurTentative, time);
      showWinningOuLoosing("Winning");
      remplirTableau();
    } else {
      //cas ou le joueur ne peut pas entrer
      alertResultat(erreurTentative, time);
      showWinningOuLoosing("LoosingHOF"); //référence (capture) https://memegenerator.net/Happy-Then-Sad-Black-Guy/caption
      alertRate();
    }
  }
}

/**
 * Affiche l'image de victoire/entré dans le HOF ou victoire/non entré au sein du HOF
 * @param {*} imageDeFinDePartie
 */
function showWinningOuLoosing(imageDeFinDePartie) {
  $(hang)
    .attr("src", "./" + imageDeFinDePartie + ".png")
    .css("display", "block");
}

/**
 * Remplissage du tableau HOF avec le prénom, le mot secret trouvé, le nombres d'erreurs ainsi que le temps mis au joueur pour trouver le mot
 */
function remplirTableau() {
  Hall_of_Fame[Hall_of_Fame.length] = new game(erreurTentative, time);
  if (Hall_of_Fame.length > 1) {
    Hall_of_Fame.sort(function (a, b) {
      return a.erreurTentative - b.erreurTentative || a.time - b.time; //tri du tableau par rapport aux nombres d'erreur réalisées. Si ces derniers sont égaux, tri par rapport au temps
    });
  }
  if (Hall_of_Fame.length > 10) {
    // cas ou le tableau est complet, le joueur à la derniere position est supprimé pour laisser entrer le nouveau joueur
    Hall_of_Fame.pop();
  }
  showDisplay(champPseudo); 
  var promptPseudo = document.getElementById("inputPseudo");
  promptPseudo.onchange = function (event) {
    pseudo = this.value;
    this.value = "";
    for (var pos = 0; pos < Hall_of_Fame.length; pos++) {
      if (
        //pour permettre de placer le pseudo du joueur et le mot secret trouvé conséquent à la bonne position dans le tableau
        erreurTentative == Hall_of_Fame[pos].erreurTentative &&
        time == Hall_of_Fame[pos].time
      ) {
        Hall_of_Fame[pos].pseudo = pseudo;
        Hall_of_Fame[pos].mot = motOrdi;
        break;
      }
    }
    for (var pos = 0; pos < Hall_of_Fame.length; pos++) {
      //affiche le contenu du tableau HOF
      $("#prenom" + pos).text(Hall_of_Fame[pos].pseudo);
      $("#mot" + pos).text(Hall_of_Fame[pos].mot);
      $("#nombre" + pos).text(Hall_of_Fame[pos].erreurTentative);
      $("#time" + pos).text(Hall_of_Fame[pos].time + "s");
    }
    showDisplay(boutonClick);
    valideHOF();
    alertBlank(resultat);
    alertBlank(apparitionMot);
    hideDisplay(pendu);
    hideDisplay(champPseudo);
  };
}

/**
 * Ajoute au sein du tableau HOF une nouvelle ligne comprenant le nombre d'erreurs et le temps du nouveau joueur seulement
 * @param {*} erreurTentative
 * @param {*} time
 */
function game(erreurTentative, time) {
  this.erreurTentative = erreurTentative;
  this.time = time;
}

/**
 *Enregistre dans le local storage le contenu du tableau HOF
 */
function valideHOF() {
  var validateHOF = Hall_of_Fame;
  localStorage["theHOF"] = JSON.stringify(validateHOF);
}

/**
 *Affiche un message au dessus de l'input où le nom est à entrer
 */
function alertRate() {
  $(HOFRate)
    .text("Mais vous ne pouvez pas entrer au sein du Hall of Fame. TRY AGAIN !")
    .css({ fontSize: "30px", color: "rgb(156, 19, 19)" });
  showDisplay(boutonClick);
}

/**
 * Charge le contenu du tableau enregistré dans le local storage
 */
function reloadHOF() {
  if ("theHOF" in localStorage) {
    rechargeHOF = JSON.parse(localStorage["theHOF"]);
    Hall_of_Fame = rechargeHOF; //conserve le contenu du tableau HOF
    for (var pos = 0; pos < rechargeHOF.length; pos++) {
      //affiche le contenu du tableau HOF
      $("#prenom" + pos).text(rechargeHOF[pos].pseudo);
      $("#mot" + pos).text(rechargeHOF[pos].mot);
      $("#nombre" + pos).text(rechargeHOF[pos].erreurTentative);
      $("#time" + pos).text(rechargeHOF[pos].time + "s");
    }
  }
}
