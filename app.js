var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var lx;
var asyncjs = require('async');

if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    jinst.setupClasspath(['lib/qe-driver-1.9.8-jar-with-dependencies.jar']);
}

var conf = {
    url: 'jdbc:leanxcale://123.45.67.89:1522/dbtest',
    drivername: 'com.leanxcale.client.Driver',
    properties: {
        user: 'user1',
        password: 'pass4user1'
    }
};
lx = new JDBC(conf);
lx.initialize(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connection initialized without error')
    }
});

lx.reserve(function (err, connObj) {
    let conn = connObj.conn;

    lx.release(connObj, function (err) {
        if (err) {
            console.error(err.message)
        }
    });


    //Create Table
    let createTable = "CREATE TABLE person (" +
        "  id BIGINT NOT NULL" +
        ", name VARCHAR " +
        ", lastName VARCHAR " +
        ", birth_date DATE " +
        ", PRIMARY KEY (id)" +
        ")";
    conn.createStatement(function (err, statement) {
        if (err) {
            console.error(err);
        } else {
            statement.execute(createTable, function (err, result) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(result)
                }
            })
        }
    });

    //First Way
    conn.createStatement(function (err, statement) {
        if (err) {
            console.error(err);
        } else {
            statement.executeQuery("SELECT * FROM person WHERE lastName = 'Doe'", function (err, resultset) {
                if (err) {
                    console.error(err);
                } else {
                    resultset.toObjArray(function (err, results) {
                        if (results.length > 0) {
                            console.log(results);
                        }
                    });
                }
            });
        }
    });

    //Second Way
    conn.prepareStatement("SELECT * FROM person WHERE lastName = ?", function (err, statement) {
        if (err) {
            console.error(err);
        } else {
            statement.setString(1, "Doe", function (err) {
                if (err) {
                    console.log(err);
                }
            });
            statement.executeQuery(function (err, resultset) {
                if (err) {
                    console.error(err);
                } else {
                    resultset.toObjArray(function (err, results) {
                        if (results.length > 0) {
                            console.log(results);
                        }
                    });
                }
            });
        }
    });

    //Insert Query
    conn.prepareStatement("INSERT INTO person VALUES (100, 'John', 'Doe',"
        + " '555333695')", function (err, statement) {
            if (err) {
                console.error(err);
            } else {
                statement.executeUpdate(
                    function (err, count) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(count);
                        }
                    });
            }
        });

    //Update Query
    conn.prepareStatement("UPDATE person SET passport = '666668888' WHERE id in (100, 101)",
        function (err, statement) {
            if (err) {
                console.error(err);
            } else {
                statement.executeUpdate(
                    function (err, count) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(count);
                        }
                    });
            }
        });

    //Delete Query
    conn.prepareStatement("DELETE FROM Registration WHERE id = 1",
        function (err, statement) {
            if (err) {
                console.error(err);
            } else {
                statement.executeUpdate(function (err, count) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(count);
                    }
                });
            }
        });

    //Drop Table
    conn.createStatement(function (err, statement) {
        if (err) {
            console.error(err);
        } else {
            statement.execute("DROP TABLE person", function (err, result) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(result);
                }
            })
        }
    });

    conn.close(function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Connection closed');
        }
    });
});

