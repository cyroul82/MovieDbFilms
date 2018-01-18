// Pour obtenir une présentation du modèle Vide, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkID=397704
// Pour déboguer du code durant le chargement d'une page dans cordova-simulate ou sur les appareils/émulateurs Android, lancez votre application, définissez des points d'arrêt, 
// puis exécutez "window.location.reload()" dans la console JavaScript.
var db= window.openDatabase("Movies", "1.0", "base de films, acteurs, et compagnies", 500000);
var listePop = {};
var listeFilm = {};
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        //chargePop();
        // Gérer les événements de suspension et de reprise Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        db.transaction(creerTableFilms, onError, onSuccess);
        db.transaction(creerTableActeurs, onError, onSuccess);
        db.transaction(chargePop, onError, onSuccess);
    };
    function chargePop() {
        for (var i = 1; i < 5; i++) {

            $.ajax({
                url: "https://api.themoviedb.org/3/movie/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page="+i,
                cache: false,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    for (var i = 0; i < data['results'].length; i++) {
                        insertFilm(data['results'][i]);
                    }
                    //displayFilms();
                }
            });

            $.ajax({
                url: "https://api.themoviedb.org/3/person/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page=" + i,
                cache: false,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    for (var i = 0; i < data['results'].length; i++) {
                        insertActor(data['results'][i]);
                    }
                    //displayFilms();
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
    tx.executeSql('CREATE TABLE IF NOT EXISTS actors(idActor unique ,name ,gender ,birth_date,birth_place ,death_day,popularity ,bio)');
    tx.executeSql('INSERT INTO actors(idActor ,name, gender, birth_date, birth_place,death_day, popularity, bio) VALUES (1542, "moi", 0, 101/02/25, "quelque part", 21542,11,01, 1.2542, "Lorem ipsum dolor ");');

}
function creerTableFilms(tx) {
    tx.executeSql('DROP TABLE IF EXISTS films');
    tx.executeSql('DROP TABLE IF EXISTS company');
    tx.executeSql('CREATE TABLE IF NOT EXISTS films(idFilm unique,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video)');
    //tx.executeSql('INSERT INTO films(id,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video) VALUES (121,"test_1","poster path",0,12/02/2014,125,"resume du film super geniaLl","titre numeo 2","le backdrop",0)');

};
function countFilms() {
    var defer = $.Deferred();
    var count = 0;
    db.transaction(function (tx) {
        tx.executeSql('SELECT idFilm,backdrop_path,original_title FROM films', [], function (tx, results) {
            defer.resolve(results.rows.length);
            return defer.promise();
            listeFilm = results;
            console.log("la liste des films : ",listeFilm);
            //var len = results.rows.count;
            //var i;
            
            //$img = $('img');
            //for (i = 0; i < len; i++) {
            //    //Set values coming from the database
            //    //console.log("Id: " + results.rows.item(i).id +"\n"+
            //    //    " titre: " + results.rows.item(i).title +"\n"+
            //    //    " backdrop: " + results.rows.item(i).backdrop_path);
            //    for (var j = 0; j < $('#film').length; j++) {
            //        if ($('#film').attr('id')!==results.rows.item(i).idFilm) {
            //            $("#film").append("<img class='col-12 col-sm-3 col-lg-2' id='" + results.rows.item(i).idFilm + "' src='https://image.tmdb.org/t/p/w500" + results.rows.item(i).backdrop_path + "' alt='" + results.rows.item(i).original_title + "' />")

            //        }
            //    }
            //}
        });
    });
}
var countPromise = countFilms();
$.when(countPromise).done(function (count) {
    displayFilm(count);
})
function displayFilm(count) {
    for (var i = 0; i < count; i++) {
        $("#film").append("<img class='col-12 col-sm-3 col-lg-2' id='" + listFilm[i].idFilm + "' src='https://image.tmdb.org/t/p/w500" + results.rows.item(i).backdrop_path + "' alt='" + results.rows.item(i).original_title + "' />");
    }
}
function insertActor(actor) {
    //db.transaction(function insert(tx) {
    
        
    //    var sql = 'INSERT INTO films(id,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video) VALUES (?,?,?,?,?,?,?,?,?,?)';
    //    tx.executeSql(sql, [leFilm['id'], leFilm['original_title'], leFilm['poster_path'], adult, leFilm['release_date'], leFilm['genre_ids'], leFilm['overview'], leFilm['title'], leFilm['backdrop_path'], video]);
    //}, function errorCB(tx, err) {
    //    console.log("Error processing SQL: " + err, tx.message);
    //}, function successCB() {
    //    //console.log("film " + leFilm['title'] + " inserted successfully");

    //});
}

function insertFilm(leFilm) {
    db.transaction(function insert(tx) {
    var adult;
    if (leFilm['adult']) { adult = 1; } else adult = 0;
    var video;
    if (leFilm['video']) { video = 1 } else video = 0;
    var sql = 'INSERT INTO films(idFilm,original_title,poster_path,adult,release_date,genre_ids,overview,title,backdrop_path,video) VALUES (?,?,?,?,?,?,?,?,?,?)';
        tx.executeSql(sql, [leFilm['id'], leFilm['original_title'], leFilm['poster_path'], adult, leFilm['release_date'], leFilm['genre_ids'], leFilm['overview'], leFilm['title'], leFilm['backdrop_path'], video]);
    }, function errorCB(tx, err) {
        console.log("Error processing SQL: "+err , tx.message);
    }, function successCB() {
        //console.log("film "+leFilm['title']+" inserted successfully");
        
    });
    }
    

       
