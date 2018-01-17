// Pour obtenir une présentation du modèle Vide, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkID=397704
// Pour déboguer du code durant le chargement d'une page dans cordova-simulate ou sur les appareils/émulateurs Android, lancez votre application, définissez des points d'arrêt, 
// puis exécutez "window.location.reload()" dans la console JavaScript.
var db;
var listePop = {};
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        chargePop();
        // Gérer les événements de suspension et de reprise Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        db = window.openDatabase("Movies", "1.0", "base de films, acteurs, et compagnies", 500000);
        db.transaction(creerTables, onError, onSuccess);
        db.transaction(chargePop, onError, onSuccess);
    };
    function chargePop() {
        for (var i = 0; i < 5; i++) {

            $.ajax({
                url: "https://api.themoviedb.org/3/movie/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page="+i,
                cache: false,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    for (var i = 0; i < data['results'].length; i++) {
                        insertFilm(data['results'][i]);
                    }
              
                }
            });
        }
    };
    afficheFilms();
    function onPause() {
        // TODO: cette application a été suspendue. Enregistrez l'état de l'application ici.
    };

    function onResume() {
        // TODO: cette application a été réactivée. Restaurez l'état de l'application ici.
    };
})();
function onSuccess(tx) {
    
};
function onError(tx) {
    alert("erreur creation tables" + "\n" + tx.message);
};
function creerTables(tx) {
    tx.executeSql('DROP TABLE IF EXISTS films');
    tx.executeSql('DROP TABLE IF EXISTS actors');
    tx.executeSql('DROP TABLE IF EXISTS company');

    tx.executeSql('CREATE TABLE IF NOT EXISTS films(id unique,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video)');
    //tx.executeSql('INSERT INTO films(id,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video) VALUES (121,"test_1","poster path",0,12/02/2014,125,"resume du film super geniaLl","titre numeo 2","le backdrop",0)');

};

function afficheFilms() {
    var films= db.transaction(function (tx) {
         tx.executeSql('select * from films');
    });
         console.log('les films',films);
}

function insertFilm(leFilm) {
    console.log("le titre dans insert",leFilm['title']);
    var adult;
    if (leFilm['adult']) { adult = 1; } else adult = 0;
    var video;
    if (leFilm['video']) { video = 1 } else video = 0;
    db.transaction(function (tx) {
        var idFilm = tx.executeSql('select * from films where films.id=' + leFilm['id']);
        console.log("select film id:" + leFilm['id'], idFilm);
        tx.executeSql('INSERT INTO films(id,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video) VALUES (' + leFilm['id'] + ',"' + leFilm['original_title'] + '","' + leFilm['poster_path'] + '","' + adult + '","' + leFilm['release_date'] + '","' + leFilm['genre_ids'] + '","' + leFilm['overview'] + '","' + leFilm['title'] + '","' + leFilm['backdrop_path'] + '",' + video + ')');
        
    },onError,onSuccess);
       
}