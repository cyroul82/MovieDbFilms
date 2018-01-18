// Pour obtenir une présentation du modèle Vide, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkID=397704
// Pour déboguer du code durant le chargement d'une page dans cordova-simulate ou sur les appareils/émulateurs Android, lancez votre application, définissez des points d'arrêt, 
// puis exécutez "window.location.reload()" dans la console JavaScript.
var db= window.openDatabase("Movies", "1.0", "base de films, acteurs, et compagnies", 500000);
var listePop = [], listeActeur = [];
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Gérer les événements de suspension et de reprise Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        db.transaction(creerTableFilms, onError, onSuccess);
        db.transaction(creerTableActeurs, onError, onSuccess);
        chargePop();
        $('body').on('click', 'img', function () { location = "detailsFilms.html?id=" + this.id });
        setInterval(function () { maFonction(); }, 5000);
    };
    function chargePop() {     
        for (var i = 0; i < 10; i++) {

            $.ajax({
                url: "https://api.themoviedb.org/3/movie/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page="+i,
                cache: false,
                type: "GET",
                dataType: "json",
                success: function (data) {  
                    for (var i = 0; i < data.results.length; i++) {                        
                        filmDbSave(data.results[i]);
                    }
                }
                
            });
            $.ajax({
                url: "https://api.themoviedb.org/3/person/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page=" + i,
                cache: false,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    for (var i = 0; i < data.results.length; i++) {
                        actorDbSave(data.results[i]);
                    }
                }
            });
        }
    };
    function onPause() {
        // TODO: cette application a été suspendue. Enregistrez l'état de l'application ici.
    };

    function onResume() {
        // TODO: cette application a été réactivée. Restaurez l'état de l'application ici.
    };
})();
function onSuccess(tx) {
    //console.log("reussi ",tx);
};
function onError(tx) {
    console.log("erreur creation tables" , tx.message);
};

function creerTableActeurs(tx) {
    tx.executeSql('DROP TABLE IF EXISTS actors');
    tx.executeSql('CREATE TABLE IF NOT EXISTS actors(idActor unique ,popularity,profile_path,name,known_for,adult,gender,birth_date,birth_place,death_day,bio)');

}

function creerTableFilms(tx) {
    tx.executeSql('DROP TABLE IF EXISTS films');
    tx.executeSql('DROP TABLE IF EXISTS company');
    tx.executeSql('CREATE TABLE IF NOT EXISTS films(idFilm unique,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video)');

};

function filmDbSave(data) {

    db.transaction(function insert(tx) {
        var adult;
        if (data.adult) { adult = 1; } else adult = 0;
        var video;
        if (data.video) { video = 1 } else video = 0;
        var sql = 'INSERT INTO films(idFilm,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video) VALUES (?,?,?,?,?,?,?,?,?,?)';
        tx.executeSql(sql, [data.id, data.original_title, data.poster_path, adult, data.release_date,data.genre_ids, data.overview, data.title, data.backdrop_path, video]);
    }, function errorCB(tx, err) {
        console.log("Error processing SQL: "+err , tx.message);
    }, function successCB() {
        
    });

}
    
function actorDbSave(data) {
    db.transaction(function insert(tx) {
        var adult;
        if (data.adult) { adult = 1; } else adult = 0;        
        var sql = ' INSERT INTO actors(idActor,popularity,profile_path,name,known_for,adult,gender ,birth_date,birth_place ,death_day,bio) VALUES (?,?,?,?,?,?,?,?,?,?,?);';
        tx.executeSql(sql, [data.id, data.popularity, data.profile_path, data.name, data.known_for, adult, "", "", "", "", ""]);
    }, function errorCB(tx, err) {
        console.log("Error processing SQL: " + err, tx.message);
    }, function successCB() {
        
    });

}
function maFonction() {
    db.transaction(function (tx) {
        //populate drop down for unites
        tx.executeSql('SELECT * FROM films', [], function (tx, results) {
            console.log("nouvelle fonction results", results);
            var len = results.rows.length;
            var i = 0;
          
            for (i = 0; i < len; i++) {
                $('#film').append('<img class="col-12 col-s-6 col-sm-4 col-lg-2" id="'+results.rows[i].idFilm+'" src="https://image.tmdb.org/t/p/w500'+results.rows[i].backdrop_path+'" alt="Alternate Text" />')
            }
            document.getElementById("xhr").innerHTML = txt;
        }, null);
    });
}
getSelectedRow = function (val) {
    var data = {};
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM films', data, function (tx, results) {
            var len = results.rows.length, i;
            console.log("longueur row  " ,data);
            for (i = 0; i < len; i++) {
                alert(results.rows.item(i).log);
            }
        }, null);
    });
}

