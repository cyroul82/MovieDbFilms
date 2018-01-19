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
        $('body').on('click', 'img', function () { location = "detailsFilms.html?id=" + this.id });
        getFile();

        if (dbFilmIsEmpty()) {
            console.log("chargement films");
            filmLoad();
            dbFilmsDisplay();
        } else dbFilmsDisplay();
        if (dbActorsIsEmpty()) {
            console.log("chargement acteurs");
            actorsLoad();
        }
    };
    $('#triPop').click( function () {
        $('#film').empty();
        dbFilmsDisplay();
    });
    $('#triNom').click( function () {
        $('#film').empty();
        dbFilmsDisplay("title");
        
    });
    function dbActorsIsEmpty() {
        var taille;
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM actors', [], function (tx, results) {
                taille = results.rows.length;
                console.log("taille db actors= "+taille);
            }, null);
            if (taille === 0) {
                return true;
            } else return false;

        })
    }



    function getFile() {

        var xhr2 = new XMLHttpRequest();
        xhr2.withCredentials = true;
        xhr2.open("GET", "http://files.tmdb.org/p/exports/movie_ids_01_19_2018.json.gz");
        xhr2.send(null);
        
        xhr2.addEventListener("readystatechange", function () {
            if (this.readyState === 4 &&this.status===200) {
                console.log("download reussi!!!");
                var gzip = this.response;
                console.log("les xml: ", this);
                //console.log("le resultat = "+result.results[12].title);
            }
        });

        //var xhr = new XMLHttpRequest();
        //xhr.responseType = XMLHttpRequestResponseType.JSON;
        //xhr.open('GET', 'http://files.tmdb.org/p/exports/movie_ids_01_19_2018.json.gz', false);
        //xhr.responseType = 'JSON';
        //xhr.onload = function (e) {
        //    if (this.status == 200) {
        //        var myBlob = this.response;
        //        // myBlob is now the blob that the object URL pointed to.
        //        console.log("my blob: "+myBlob.name);
        //    }
        //};
        //xhr.send(null);
        

        
       }
    function dbFilmIsEmpty() {
        
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM films', [], function (tx, results) {
                if (results.rows.length <1) {
                    alert('db vide');
                    return true;
                } else return false;
   
            }, null);

        })
        
    }
    function actorsLoad() {
        for (var i = 0; i < 20; i++) {
            var xhr2 = new XMLHttpRequest();
            xhr2.withCredentials = true;
            xhr2.open("GET", "https://api.themoviedb.org/3/person/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page=" + i);
            xhr2.send(null);

            xhr2.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    //console.log(this.responseText);
                    var result = JSON.parse(this.response).results;
                    for (var j = 0; j < result.length; j++) {
                        var actor = result[j];
                        actorDbSave(actor);
                    }
                    //console.log("le resultat = "+result.results[12].title);
                }
            });
        }
    }
    function filmLoad() {     
        for (var i = 1; i < 20; i++) {            

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open("GET", "https://api.themoviedb.org/3/movie/popular?page="+i+"&language=en-US&api_key=85a1114cc9bcee8c748abdaaade8169a");
            xhr.send(null);

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE ) {
                    var result = JSON.parse(this.response).results;
                    for (var j = 0; j < result.length; j++) {
                        var film = result[j];
                        dbFilmExist(film);
                        filmDbSave(film);
                    }
                }
            });

            

            //$.ajax({
            //    url: "https://api.themoviedb.org/3/movie/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page="+i,
            //    cache: false,
            //    type: "GET",
            //    dataType: "json",
            //    success: function (data) {  
            //        for (var i = 0; i < data.results.length; i++) {                        
            //            filmDbSave(data.results[i]);
            //        }
            //    }
                
            //});
            //$.ajax({
            //    url: "https://api.themoviedb.org/3/person/popular?api_key=85a1114cc9bcee8c748abdaaade8169a&language=en-US&page=" + i,
            //    cache: false,
            //    type: "GET",
            //    dataType: "json",
            //    success: function (data) {
            //        for (var i = 0; i < data.results.length; i++) {
            //            actorDbSave(data.results[i]);
            //        }
            //    }
            //});
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
function dbFilmExist(film) {
    db.transaction(function (tx) {
        tx.executeSql('select * from film where idFilm=' + film.id, [], function (tx, res) {
            console.log("les resultat test:",res);
        })
    })
}
function creerTableActeurs(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS actors(idActor unique ,popularity,profile_path,name,known_for,adult,gender,birth_date,birth_place,death_day,bio)');
}

function creerTableFilms(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS films(idFilm unique,adult,backdrop_path,belongs_to_collection,genres,imdb_id,original_language,original_title,overview,popularity,poster_path,production_companies,production_countries,release_date,revenue,runtime,spoken_languages,status,tagline,title,video,vote_average,vote_count)');
};

function filmDbSave(data) {

    db.transaction(function insert(tx) {
        var adult;
        if (data.adult) { adult = 1; } else adult = 0;
        var video;
        if (data.video) { video = 1 } else video = 0;
        var sql = 'INSERT INTO films(idFilm,popularity,original_title,poster_path,adult,release_date,genres,overview,title,backdrop_path,video,belongs_to_collection,imdb_id,original_language,production_companies,production_countries,revenue,runtime,spoken_languages,status,tagline,vote_average,vote_count) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        tx.executeSql(sql, [data.id,data.popularity, data.original_title, data.poster_path, adult, data.release_date,data.genre_ids, data.overview, data.title, data.backdrop_path, video,,,,,,,,,,,,,]);
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
function dbFilmsDisplay(type) {
    var sql = 'SELECT * FROM films';
    switch (type) {
        case "title":
            sql += ' order by original_title';
            console.log('order by title');
            break;
        default:
            sql += ' order by popularity';
            console.log('order by popularity');
            break;
    };
    db.transaction(function (tx) {
        tx.executeSql(sql, [], function (tx, res) {
            var len = res.rows.length;

            for (var i = 0; i < len; i++) {
                console.log("le film a afficher:", res.rows[i]);
                var image = "https://image.tmdb.org/t/p/w500" + res.rows[i].poster_path;
                if (image == "https://image.tmdb.org/t/p/w500") {
                    image = "images/unavailable.png";
                };
                $('#film').append('<img class="icons col-xs-6 col-sm-3 col-lg-2" id="' + res.rows[i].idFilm + '" src="' + image + '" alt="' + res.rows[i].original_title + '" />');
            }
        }
            )
    }
    );
}



