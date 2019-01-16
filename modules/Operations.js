module.exports = function () {

    var opers = {

        //insert

        Insert: function (collection, data) {
            collection.insert(data, function (err, result) {
                console.log(result)
            });
        },

        //select all - zwraca tablic� pasuj�cych dokument�w

        SelectAll: function (collection, callback) {
            collection.find({}).toArray(function (err, items) {
                //console.log(items)
                if (err) console.log(err);
                else callback(items);
            });
        },

        //select - zwraca tablic� pasuj�cych dokument�w, z ograniczeniem

        SelectAndLimit: function (collection, callback) {
            collection.find({ login: "test" }).toArray(function (err, items) {
                console.log(items)
                if (err) console.log(err)
                    //funkcja zwracaj�ca dane na zewn�trz
                else callback(items)
            });
        },

        //delete - usuni�cie poprzez id - uwaga na ObjectID

        DeleteById: function (ObjectID, collection, id) {
            collection.remove({ _id: ObjectID(id) }, function (err, data) {
                console.log(data)
            })
        },

        // update - aktualizacja poprzez id - uwaga na ObjectID
        // uwaga: bez $set usuwa poprzedni obiekt i wstawia nowy
        // z $set - dokunuje aktualizacji tylko wybranego pola

        UpdatePassById: function (ObjectID, collection, data, callback) {
            collection.updateOne(
                { _id: ObjectID(data.id) },
                { $set: { password: data.password } },
                function (err, data) {
                    callback(data);
                    console.log("update: " + data)
                })
        },

        UpdateById: function (ObjectID, collection, data, callback) {
            collection.updateOne(
                { _id: ObjectID(data.id) },
                { $set: { password: data.password } },
                { $set: { login: data.login } },
                function (err, data) {
                    callback(data);
                    console.log("update: " + data)
                })
        },

    }

    return opers;

}
