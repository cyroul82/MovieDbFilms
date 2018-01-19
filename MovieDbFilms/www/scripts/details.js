// Pour obtenir une présentation du modèle Vide, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkID=397704
// Pour déboguer du code durant le chargement d'une page dans cordova-simulate ou sur les appareils/émulateurs Android, lancez votre application, définissez des points d'arrêt, 
// puis exécutez "window.location.reload()" dans la console JavaScript.
var id = getUrlVars()["id"];
console.log("id= ", id);
var movieId = new Array(),
    sex,

    // 2. This code loads the IFrame Player API code asynchronously.
    player,
    tag = document.createElement('script'),
    firstScriptTag = document.getElementsByTagName('script')[0],
    done = false,
    listeVideo = new Array(),
    $Retour = $('#btnRetour');
function getUrlVars() {
    var vars = [], hash; // Déclaration d'un tableau vars et d’une variable "hash"

    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); /* split des paramètres après le "?" de l'url ; les chaînes de
        caractères possèdent une méthode split() qui permet de les découper en un tableau,
        en fonction d'un séparateur précisé.*/
    console.log("les hashes", hashes);
    console.log('le hashes length = ', hashes.length);
    for (var i = 0; i < hashes.length; i++) // boucle sur le nombre de paramètres
    {
        console.log('le hash brut ', hashes);
        hash = hashes[i].split('='); // split des paires nom et valeur du paramètre
        console.log('le hash = ', hash);
        console.log("le hash 0 ", hash[0]);
        console.log('le hash 1: ', hash[1]);
        vars.push(hash[0]);
        /* La méthode push() permet d'ajouter un ou plusieurs items à un tableau,
        push() peut recevoir un nombre illimité de paramètres, et chaque paramètre
        représente un item à ajouter à la fin du tableau.
        La méthode unshift() fonctionne comme push(), excepté que les items sont ajoutés
        au début du tableau. Cette méthode n'est pas très fréquente mais peut être utile.
        Les méthodes shift() et pop() retirent respectivement le premier et le dernier
        élément du tableau. */
        vars[hash[0]] = hash[1]; // insertion des valeurs dans le tableau
    }
    return vars; // retourne le tableau de paramètres
};

$Retour.click(function () {
    window.location = "index.html";
});
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Gérer les événements de suspension et de reprise Cordova
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
    };

    function onPause() {
        // TODO: cette application a été suspendue. Enregistrez l'état de l'application ici.
    };

    function onResume() {
        // TODO: cette application a été réactivée. Restaurez l'état de l'application ici.
    };
})();
tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady(id) {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: id,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}
(function infoFilm() {
    $.ajax({

        url: "https://api.themoviedb.org/3/movie/" + id + "?api_key=85a1114cc9bcee8c748abdaaade8169a&language=fr-FR",
        cache: false,
        type: "GET",
        dataType: "json",
        success: function (data) {

            $('#listFilm').append("<p class='panel'>" + data.original_title + "</p><img class='col-10' src='https://image.tmdb.org/t/p/w500" + data.poster_path + "' alt=" + data.original_title + " /><h2 > Synopsis : </br><span >" + data.overview + "</span></h2><p > Sortie :  " + data.release_date + "</p>");

        }
    });
    $.ajax({

        url: "https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=85a1114cc9bcee8c748abdaaade8169a",
        cache: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.cast.length; i++) {

                if (data.cast[i]['gender'] === 0) {
                    sex = "Non défini";
                }
                else if (data.cast[i]['gender'] === 1) {
                    sex = "Femme";
                } else sex = "Homme";
                console.log("les acteurs  :", data.cast[i]['character']);
                $('#persos').append("<div id='detailsCasting' ><p > Personnage : " + data.cast[i]['character'] + "</br> sexe: " + sex + "</p><p>" + data.cast[i]['name'] + "</p><img class='col-8' src='https://image.tmdb.org/t/p/w500/" + data.cast[i]['profile_path'] + "' alt=" + data.cast[i]['charactere'] + " /><hr /></div>");

            }

        }
    });
})();
$('#btnCast').click(function () {
    if ($('#detailsCasting').css('display') === 'none') {

        $('#detailsCasting').css('display', 'block');
    }
});
(function getMovies() {
    $.ajax({

        url: "https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US",
        cache: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log("les data des videos ::", data);
            movieId.push(data.results);
            console.log("la longueur des results  ::", data.results.length);
            //onYouTubeIframeAPIReady(data.results[i]['key']);
            for (var i = 0; i < data.results.length + 1; i++) {
                var idVid = data.results[i].key;
                $('#player').append('<iframe id="player" src= "http://www.youtube.com/embed/' + data.results[i].key + '?enablejsapi=1" frameborder= "0" ></iframe >');
            }
        }
    });
})();



