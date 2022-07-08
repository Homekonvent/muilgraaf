let BASE_URL = "/";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

function login() {
    let user = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;
    fetch(BASE_URL + "users/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ email: user, password: pass })

    }).then((data) => data.json())
        .then((data) => {
            if (data.hasOwnProperty("token")) {
                let decoded = parseJwt(data.token);
                document.getElementById("login").style.display = "none";
                document.getElementById("profile").src = "/static/" + decoded.profile;
                document.getElementById("content").style.display = "block";

                window.localStorage.setItem("token", data.token);

                fetch(BASE_URL + "graph/name",
                        {
                            method: "get",
                            redirect: 'follow', // manual, *follow, error
                            referrerPolicy: 'no-referrer'
                        }).then((names) => names.json())
                    .then((names) => {
                        if (names.hasOwnProperty("names")) {
                            // create an array with nodes
                            let nodes = new vis.DataSet(names["names"]);
                            fetch(BASE_URL + "graph/edge",
                                    {
                                        method: "get",
                                        redirect: 'follow', // manual, *follow, error
                                        referrerPolicy: 'no-referrer'
                                }).then((edges) => edges.json())
                                .then((edge) => {
                                    if (edge.hasOwnProperty("edges")) {
                                        // create an array with edges
                                        let edges = new vis.DataSet(edge["edges"]);

                                        // create a network
                                        let container = document.getElementById("mynetwork");
                                        let data = {
                                            nodes: nodes,
                                            edges: edges,
                                        };
                                        let network = new vis.Network(container, data, {});
                                    }
                                });
                        }
                    });

            }
        });
}

function logout() {
    window.localStorage.removeItem("token")
    document.getElementById("login").style.display = "block";
    document.getElementById("content").style.display = "none";
}

function testToken(event) {
    if (window.localStorage.getItem('token') !== null) {
        let decoded = parseJwt(window.localStorage.getItem('token'))
        let d = new Date(0);
        d.setUTCSeconds(decoded.exp);
        if (Date.now() > d) {
            window.localStorage.removeItem("token");
            document.getElementById("login").style.display = "block";
            document.getElementById("content").style.display = "none";
        }
    }
}

window.addEventListener("focus", testToken, false);

document.onload = init();

function init() {
    testToken(null);
    if (window.localStorage.getItem("token") !== null) {
        let decoded = parseJwt(window.localStorage.getItem("token"))
        document.getElementById("login").style.display = "none";
        document.getElementById("content").style.display = "block";
        document.getElementById("welcome").style.display = "block";
        document.getElementById("profile").src = "/static/" + decoded.profile;
    }
}
