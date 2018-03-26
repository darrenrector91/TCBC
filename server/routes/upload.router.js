const express = require('express');
const router = express.Router();
const multer = require('multer');
const destination = 'server/public/uploads/'
const upload = multer({
  dest: destination
})
var csv = require('fast-csv')
var parse = require('csv-parse');
var fs = require('fs');
var lineReader = require('readline');
const pool = require('../modules/pool');

router.post('/', upload.single('file'), function(req, res) {
    var file = req.file;
    var stream = fs.createReadStream(file.path);
            csv.fromStream(stream, {
                    headers: [
                        "member_id",
                        "first_name",
                        "middle_name",
                        "last_name",
                        'city',
                        'state',
                        'zip',
                        'gender', ,
                        'phone_1',
                        'phone_2', ,
                        'membership_start',
                        'membership_expiration', ,
                        'email'

                    ]
                })
                .on('data', function(data, callback) {
                    let queryText = 
                    `INSERT INTO "member_info"
                    (member_id, 
                    membership_start,
                    membership_expiration, 
                    first_name,
                    middle_name, 
                    last_name,
                    city,
                    state,
                    zip,
                    gender,
                    phone_1,
                    phone_2, 
                    email)
                    values ($1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7,
                            $8,
                            $9,
                            $10,
                            $11,
                            $12,
                            $13)
                            ON CONFLICT (member_id) DO UPDATE
                            SET membership_start = excluded.membership_start,
                            membership_expiration = excluded.membership_expiration,
                            first_name = excluded.first_name,
                            middle_name = excluded.middle_name,
                            last_name = excluded.last_name,
                            city = excluded.city,
                            state = excluded.state,
                            zip = excluded.zip,
                            gender = excluded.gender,
                            phone_1 = excluded.phone_1,
                            phone_2 = excluded.phone_2,
                            email = excluded.email;`;
                    pool.query(queryText, [
                            data.member_id,
                            data.membership_start,
                            data.membership_expiration,
                            data.first_name,
                            data.middle_name,
                            data.last_name,
                            data.city,
                            data.state,
                            data.zip,
                            data.gender,
                            data.phone_1,
                            data.phone_2,
                            data.email
                        ])
                        .then((result) => {
                               ('success', result);
                        })
                        .catch((err) => {
                               ('error', err);
                        });
                }).on("end", function() {
                    res.sendStatus(200);
                       ("done");
                })

        });
module.exports = router;