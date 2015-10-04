/* 
 * DOM:
 buttons: team1, team2 - innerHTML Team1Name<br>Benis: Team1Benis<br>Team1Fehler
 progress: team1progress, team2progress - style="width: X%"
 input: tagfeld - value
 div: taglist - innerHTML <span class="label label-success">TAG</span>
 img: pImage - src
 */

var richtigesOrange = "#ee4d2e";
var richtigesGrau = "#161618";
var neuschwuchtel = "#e108e9";
var fliessentisch = "#6c432b";
var schwuchtel =    "#ffffff";
var altschwuchtel = "#5bb91c";
var sfw =           "#5cb85c";

var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

function logPic(id,user) {
    var a = document.createElement('a');
    var linkText = document.createTextNode("zum Post "+id+" von "+user);
    a.appendChild(linkText);
    a.title = id;
    a.href = "http://pr0gramm.com/new/"+id;
    a.target = "_blank";
    document.getElementById('gespielt').appendChild(a);
    document.getElementById('gespielt').appendChild(document.createElement('br'));
}

function setCurrentTeam(nr) {
    console.log('Aktuelles Team: '+nr);
    localStorage.currentTeam = nr;
    
    teamfarbe = "warning";
    if (nr == 1) {
        teamfarbe = "info";
    }
    document.getElementById("tagbutton").setAttribute("class", "btn btn-"+teamfarbe);
}

function newPic() {
    items = $("div").data("pItems");
    var i = Math.round(Math.random() * (items.length));
    var id = items[i].id;
    var image = items[i].image;
    var user = items[i].user;
    
    var extension = image.split('.');
    extension = extension[extension.length - 1];
    if (extension == 'webm') {
        document.getElementById('pVideo').src = 'http://img.pr0gramm.com/'+image;
        document.getElementById('pImage').src = '';
        document.getElementById('pImage').style = 'visibility : hidden';
        document.getElementById('pVideo').style = "width: 100%; height: auto;";
    } else {
        document.getElementById('pImage').src = 'http://img.pr0gramm.com/'+image;
        document.getElementById('pVideo').src = '';
        document.getElementById('pVideo').style = 'visibility : hidden';
        document.getElementById('pImage').style = "width: 100%; height: auto;";
    }
    
    console.log('newPic: '+i+' - '+id+' - '+image);
    document.getElementById('taglist').innerHTML = '';
    //document.getElementById('team1progress');
    getTags(id);
    logPic(id,user);
    addTeamData("team1", 0, -100);
    addTeamData("team2", 0, -100);
    
}


function setTeamData(team, benis, fehler) {
    localStorage.setItem(team+"benis", benis);
    localStorage.setItem(team+"fehler", fehler);   
    
    var fehlerpic = '';
    for (i=0; i<fehler; i++) {
        fehlerpic = fehlerpic + '<span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>'; 
    }
    //document.getElementById(team).innerHTML = localStorage.getItem(team+"name")+"<br>Benis: "+benis+"<br>"+fehlerpic;
}

function addTeamData(team, benis, fehler) {
    var oldbenis = localStorage.getItem(team+"benis");
    var oldfehler = localStorage.getItem(team+"fehler");
    
    benis = parseInt(benis) + parseInt(oldbenis);
    fehler = parseInt(fehler) + parseInt(oldfehler);
    if (fehler < 0) { fehler = 0; }
    
    localStorage.setItem(team+"benis", benis);
    localStorage.setItem(team+"fehler", fehler);   
    
    var fehlerpic = '';
    for (i=0; i<fehler; i++) {
        fehlerpic = fehlerpic + '<span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>'; 
    }
    document.getElementById(team).innerHTML = localStorage.getItem(team+"name")+"<br>Benis: "+benis+"<br>"+fehlerpic;
}


function submitTag() {
    var tag = document.getElementById('tagfeld').value;
    localStorage.currentTag = tag;
    document.getElementById('tagfeld').value = "";
    var check = checkTag(tag);
    
    console.log('submitTag - '+ tag+' check: '+check);
    setTeamData();
    checkOverview();
}

function checkOverview() {
    var team1Fehler = localStorage.team1fehler;
    var team1Benis = localStorage.team1benis;
    var team2Fehler = localStorage.team2fehler;
    var team2Benis = localStorage.team2benis;
    
    var resttags = $("div").data("pTags");
    var reason = 0;
    
    if (team1Fehler >= 5) {
        reason = 1;
        label = 'Gar nicht mal so gut, Kevin!';
        body = '';
    }
    if (team2Fehler >=5) { 
        reason = 1;
        label = 'Gar nicht mal so gut, Falk!';
        body = '';
    }
    if (resttags.length == 0) {
        reason = 1;
        label = 'Der hat doch an!';
        body = '';        
    }
    
    if (reason > 0) {
        document.getElementById('modalOverviewLabel').innerHTML = label;
        document.getElementById('modalOverviewBody').innerHTML = "<h5>Geraten</h5>"+ document.getElementById('taglist').innerHTML+
                "<h5>Das fehlte noch</h5>"+ restTags();
        $('#modalOverview').modal();
        reason = 0;
    }
}

function getTags(id){
    getJSON('./json/infoItemis'+id+'.json').then(function(data) {
        //data.items[0].id / image
        //localStorage.currentTagCount = data.tags.length;
        document.getElementById('tagcount').innerHTML = 'Tags: (' + data.tags.length + ')';
        for (i=0; i< data.tags.length; i++) {
            console.log("Richtige Tags: " + data.tags[i].tag);
        }
        $("div").data("pTags", data.tags);
    }, function(status) { //error detection....
      alert('Something went wrong.');
    });    
}

function showTags() {
    var tags = $("div").data("pTags");
    var show = 'Richtige Tags:\n';
    for (i=0; i < tags.length; i++) {
        show = show + tags[i].tag + '\n';
    }
    alert(show);
}

function restTags() {
    var tags = $("div").data("pTags");
    var show = '';
    for (i=0; i < tags.length; i++) {
        show = show + '<span class="label label-success">' +tags[i].tag + '</span> ';
    }
    return show;
}

function addTagList(tag, farbe) {
    var span = document.createElement('span');
    var linkText = document.createTextNode(tag);
    span.appendChild(linkText);
    span.setAttribute("class","label label-"+farbe);
    document.getElementById('taglist').appendChild(span);
    document.getElementById('taglist').appendChild(document.createTextNode(' '));
}

function checkTag(tag) {
    tags = $("div").data("pTags");
    for (i=0; i < tags.length; i++) {
        if (tags[i].tag.toUpperCase() == tag.toUpperCase() || soundex(tags[i].tag) == soundex(tag) ) {
            addTagList(tags[i].tag, "success");
            $("div").data("pTags", tags.slice(0,i).concat( tags.slice(i+1) ));
            addTeamData("team"+ localStorage.currentTeam, 1000, 0);
            return true;
        }
    }
    addTagList(tag, "danger");
    addTeamData("team"+ localStorage.currentTeam, -200, 1);
    return false;
}

function Initialize(items) {
    console.log('Initialze(); - aufgerufen');
    $( "div" ).data( "pItems", items );
    localStorage.setItem("team1name","Kevin");
    localStorage.setItem("team2name","Falk");    
    setTeamData("team1",0,0);
    setTeamData("team2",0,0);
    setCurrentTeam(1);
    newPic();
    $('#myModal').modal();   
    //JSONworkaround(items);
}

getJSON('./itemsGET-2.json').then(function(data) {
    //data.items[0].id / image
    Initialize(data.items);
}, function(status) { //error detection....
  alert('Something went wrong.');
});


function JSONworkaround(items) {
    var idlist = '';
    for (i=0; i< items.length; i++) {
        idlist = idlist + 'curl http://pr0gramm.com/api/items/info?itemId=' + items[i].id + ' > infoItemis' + items[i].id + '.json &&\n';
    }
    alert(idlist);
}


function soundex(str) {
    
  str = (str + '')
    .toUpperCase();
  if (!str) {
    return '';
  }
  var sdx = [0, 0, 0, 0],
    m = {
      B : 1,
      F : 1,
      P : 1,
      V : 1,
      C : 2,
      G : 2,
      J : 2,
      K : 2,
      Q : 2,
      S : 2,
      X : 2,
      Z : 2,
      D : 3,
      T : 3,
      L : 4,
      M : 5,
      N : 5,
      R : 6
    },
    i = 0,
    j, s = 0,
    c, p;

  while ((c = str.charAt(i++)) && s < 4) {
    if (j = m[c]) {
      if (j !== p) {
        sdx[s++] = p = j;
      }
    } else {
      s += i === 1;
      p = 0;
    }
  }

  sdx[0] = str.charAt(0);
  return sdx.join('');
}