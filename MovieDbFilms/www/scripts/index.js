// Pour obtenir une présentation du modèle Vide, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkID=397704
// Pour déboguer du code durant le chargement d'une page dans cordova-simulate ou sur les appareils/émulateurs Android, lancez votre application, définissez des points d'arrêt, 
// puis exécutez "window.location.reload()" dans la console JavaScript.
var db, listePop = new Array();
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
    };
    function chargePop() {
        alert("charge pop");
        $.ajax({
            url: "https://api.themoviedb.org/3/movie/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page=1",
            cache: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log('data trouver :' , data['results']);
                listePop.push(data['results']);
                console.log('la liste', listePop[0]);
                //id, adult, backdrop, genre1, genre2, genre3, langue, titreOriginal, resume, poster, duree, dateSortie, titre2, video, budget, Production, Pays, recette
                for (var i = 0; i < listePop[0].length; i++) {

                }
            }
        });
    };
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

    tx.executeSql('CREATE TABLE IF NOT EXISTS films(id,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video)');
    tx.executeSql('INSERT INTO films(id,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video) VALUES (121,"test_1","poster path",0,12/02/2014,125,"resume du film super geniaLl","titre numeo 2","le backdrop",0)');
};
