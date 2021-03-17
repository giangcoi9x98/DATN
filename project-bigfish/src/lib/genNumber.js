const enc_hext = require("crypto-js/enc-hex");
const enc_utf8 = require("crypto-js/enc-utf8");
const SHA256 = require("crypto-js/sha256");
const _ = require('lodash')
const SHA512 = require('crypto-js/hmac-sha512')
const roll_number = (server_seed, client_seed, nonce) => {
    nonce += ''
    const string1 = nonce.concat(":", server_seed, ":", nonce);
    const string2 = nonce.concat(":", client_seed, ":", nonce);
    const hmac512 = SHA512(string1, string2).toString(enc_hext);
    const string3 = hmac512.substring(0, 8);
    const number = parseInt(string3, 16);
    return (Math.round(number / 429496.7295)).toFixed(0);
}

//gen server seed
//const next_server_seed = SHA256(makeid(_.rand(16,32))).toString(enc_hext);
//const next_server_seed_hash = SHA256(next_server_seed).toString(enc_hext);

const next_server_seed = () => SHA256(makeid(_.random(16, 32))).toString(enc_hext);
const next_server_seed_hash = (next_server_seed) => SHA256(next_server_seed).toString(enc_hext);
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 

const free_payout_table = [
    ["0 - 9885", "9886 - 9985", "9986 - 9993", "9994 - 9997", "9998 - 9999", "10000"],
    [1, 10, 100, 1000, 10000, 100000]
]

const check_free_payout = (num, free_payout_table) => {
    let return_Value = 0;
    free_payout_table[0].map((value, i) => {
        const split = (value + '').split('-');
        if (split.length === 1) {
            if (Number(split[0]) === num) {

                return_Value = free_payout_table[1][i];
                return true;
            }
        } else {
            if (Number(split[0]) <= num && Number(split[1]) >= num) {

                return_Value = typeof free_payout_table[1][i] === 'string' ? parseFloat(free_payout_table[1][i].split('-')[0]) : free_payout_table[1][i];
                return true;
            }
        }
    });
    return return_Value;
}

module.exports = {
    check_free_payout,
    roll_number,
    next_server_seed,
    next_server_seed_hash
}