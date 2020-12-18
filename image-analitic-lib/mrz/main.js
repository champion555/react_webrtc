'use strict';

var EventEmitter = require('events').EventEmitter;


export function initWorker(Worker, mrz_worker = window.mrz_worker) {

    var MrzDetector = function () {
        var blob = new Blob([mrz_worker.toString().replace(/^function .+\{?|\}$/g, '')], { type: 'text/javascript' });
        var objectURL = URL.createObjectURL(blob);
        var worker = new Worker(objectURL);

        this.worker = worker;
        worker.addEventListener('error', function (e) {

            $('html').html(['<pre>', e.message, ' (', e.filename, ':', e.lineno, ':', e.colno, ')</pre>'].join(''));
        }, false);

        worker.addEventListener('message', (e) => {
            var data = e.data;

            switch (data.type) {
                case 'progress':
                    this.emit('progress', data);

                    break;

                case 'error':
                    this.emit('error', data.error);
                    $('.progress').removeClass('visible');

                    setTimeout(function () {
                        window.alert(data.error);
                    }, 100);
                    break;

                case 'result':
                    function escape(t) {
                        return t.replace(/</g, '&lt;');
                    }
                    var html;
                    var info;
                    var result = data.result;
                    if (result.parsed && result.parsed.modified) {
                        info = result.parsed.modified;
                    } else if (result.ocrized) {
                        info = result.ocrized;
                    } else {
                        info = [];
                    }
                    var infoClone = JSON.parse(JSON.stringify(info))
                    info = info.join('\n');
                    var cardInfo = parse(info);
                    if (infoClone) {
                        console.error(infoClone)
                        cardInfo.mrz_line1 = infoClone[0];
                        cardInfo.mrz_line2 = infoClone[1];
                        cardInfo.mrz_line3 = infoClone[2];
                    } else {
                        cardInfo.mrz_line1 = null;
                        cardInfo.mrz_line2 = null;
                        cardInfo.mrz_line3 = null;
                    }


                    this.emit('result', cardInfo);

                    break;

                default:
                    console.log(data);
                    break;
            }
        }, false);


        var pathname = document.location.pathname.split('/');
        pathname.pop();
        pathname = pathname.join('/');

        worker.postMessage({
            cmd: 'config',
            config: {
                fsRootUrl: document.location.origin + pathname
            }
        });
    }

    MrzDetector.prototype = new EventEmitter;
    MrzDetector.prototype.detectPassport = function (result) {
        this.worker.postMessage({ cmd: 'process', image: result });
    }

    return new MrzDetector();
}

export function parse(data) {
    var type = false;
    var total_length = data.replace(/\n/g, '').length;
    var rows = data.split("\n");

    // rows[row].substr((start - 1), (finish - start) + 1);

    let doc = false;
    var card_info = "";
    var card_type = "";
    // let first = data.sub(0, 1);
    let first = rows[0].substr(0, 1);
    console.log(first);
    // let country = data.sub(0, 3, 5);
    let country = rows[0].substr(2, 3);

    console.log(country);



    if (country === 'GBR') {
        if (first === 'P' && rows.length == 2 && total_length === 88) {
            card_type = "Passport";
            return get_info(country, card_type);
        } else if ((rows[0].substr(0, 2) === 'IR' && rows.length == 3 && total_length === 90) || (rows[0].substr(0, 2) == 'VR' && rows.length == 2 && total_length === 72)) {
            card_type = "Residence Permit";
            return get_info(country, card_type);
        }
    } else if (country === 'ITA') {
        if (first === 'P' && rows.length == 2 && total_length === 88) {
            card_type = "Passport";
            return get_info(country, card_type);
        } else if ((rows[0].substr(0, 2) === 'C<' || rows[0].substr(0, 2) === 'CI') && rows.length == 3 && total_length === 90) {
            card_type = "ID Card";
            return get_info(country, card_type);
        } else if ((rows[0].substr(0, 1) === 'C' || rows[0].substr(0, 2) === 'I<') && rows.length == 3 && total_length === 90) {
            card_type = "Residence Permit";
            return get_info(country, card_type);
        }
    } else if (country === 'DEU') {
        if (first === 'P' && rows.length == 2 && total_length === 88) {
            card_type = "Passport";
            return get_info(country, card_type);
        } else if (rows[0].substr(0, 2) === 'ID' && rows.length == 3 && total_length === 90) {
            card_type = "ID Card";
            return get_info(country, card_type);
        } else if ((rows[0].substr(0, 2) === 'A' && rows.length == 3 && total_length === 90)) {
            card_type = "Residence Permit";
            return get_info(country, card_type);
        }
    } else if (country === 'FRA') {
        if (first === 'P' && rows.length == 2 && total_length === 88) {
            card_type = "Passport";
            return get_info(country, card_type);
        } else if (rows[0].substr(0, 2) === 'ID' && rows.length == 2 && total_length === 72) {
            card_type = "ID Card";
            return get_info(country, card_type);
        } else if ((rows[0].substr(0, 2) === 'IR' && rows.length == 3 && total_length === 90) || (rows[0].substr(0, 2) == 'TS' && rows.length == 2 && total_length === 72)) {
            card_type = "Residence Permit";
            return get_info(country, card_type);
        }
    } else {
        if (first === 'I') {
            card_type = "ID Card";
            return get_info(country, card_type);
        } else if (first === 'P' && rows.length == 2 && total_length === 88) {
            card_type = "Passport";
            return get_info(country, card_type);
        } else if (first === 'C' || first === 'A' || first === 'I' && rows.length == 3 && total_length === 90) {
            card_type = "Residence Permit";
            return get_info(country, card_type);
        } else {
            card_info = { recognization: false, type: null, country: null, message: 'Invalid Image or \nNot ID Card, Passport, Resindence Permit' };
            return card_info;
        }
    }
    // if (first === 'I' && country === 'FRA') {
    //     console.log("FranceID");
    //     card_type = "FranceID";
    //     return card_type;
    // } else if (rows.length === 2 && total_length === 88 && first === 'P') {
    //     console.log("TravelDocument3");
    //     card_type = "TravelDocument3";
    //     return card_type;
    // } else if (rows.length === 2 && total_length === 88 && first === 'V') {
    //     console.log("VisaA");
    //     card_type = "VisaA";
    //     return card_type;
    // } else if (rows.length === 2 && total_length === 72 && first === 'V') {
    //     console.log("VisaB");
    //     card_type = "VisaB";
    //     return card_type;
    // } else if (rows.length === 3 && total_length === 90) {
    //     console.log("TravelDocument1");
    //     card_type = "TravelDocument1";
    //     return card_type;
    // } else if (rows.length === 2 && total_length === 72) {
    //     console.log("TravelDocument2");
    //     card_type = "TravelDocument2";
    //     return card_type;
    // }


    // return card_info;
    if (doc === false) {
        return false;
    }

    return SimpleDocument(doc);

};

function get_info(str1, str2) {
    var country_name = "";
    let card_info = "";
    if (str1.indexOf('D') == 0) {
        country_name = "Germany";
    } else {
        country_name = get_country(str1);
    }

    if (country_name != '') {
        card_info = { recognization: true, type: str2, country: country_name }
    } else {
        card_info = { recognization: false, type: null, country: null, message: 'Invalid Image or \nNot ID Card, Passport, Resindence Permit' };
    }

    return card_info;
}

function get_country(str) {
    let countryName = "";
    if (str === "FRA") {
        countryName = "France";
    } else if (str === "ITA") {
        countryName = "Italy";
    } else if (str === "ESP") {
        countryName = "Spain";
    } else if (str === "PRT") {
        countryName = "Portugal";
    } else if (str === "BEL") {
        countryName = "Belgium";
    } else if (str === "LUX") {
        countryName = "Luxembourg";
    } else if (str === "CHE") {
        countryName = "Switzerland";
    } else if (str === "GBP" || str === "GBR" || str === "GBD" || str === "GBN" || str === "GBO" || str === "GBS") {
        countryName = "United Kindom";
    } else if (str === "USA") {
        countryName = "United States";
    } else if (str === "CAN") {
        countryName = "Canada";
    } else if (str === "BRA") {
        countryName = "Brazil";
    } else if (str === "CHN") {
        countryName = "China";
    } else if (str === "IND") {
        countryName = "India";
    } else if (str === "RUS") {
        countryName = "Russian Federation";
    } else if (str === "JPN") {
        countryName = "Japan";
    } else if (str === "NGA") {
        countryName = "Nigeria";
    } else if (str === "ZAF") {
        countryName = "South Africa";
    } else if (str === "KOR") {
        countryName = "Republic of Korea";
    } else if (str === "MEX") {
        countryName = "Mexico";
    } else if (str === "ARG") {
        countryName = "Argentina";
    } else if (str === "TUR") {
        countryName = "Turkey";
    } else if (str === "VNM") {
        countryName = "Viet Nam";
    } else if (str === "ISR") {
        countryName = "Israel";
    } else if (str === "EGY") {
        countryName = "Egypt";
    } else if (str === "IRL") {
        countryName = "Ireland";
    } else if (str === "DNK") {
        countryName = "Denmark";
    } else if (str === "POL") {
        countryName = "Poland";
    } else if (str === "SWE") {
        countryName = "Sweden";
    } else if (str === "AUS") {
        countryName = "Australia";
    }

    return countryName;
}

function sub(row, start, finish) {
    if (typeof finish === 'undefined') {
        finish = start;
    }

    return this.rows[row].substr((start - 1), (finish - start) + 1);
};

function SimpleDocument(doc) {
    let names = this.get_names(doc.names);
    let new_doc = {
        'document_type': this.clean(doc.document_type),
        'document_country': this.get_country(doc.document_country),
        'document_number': this.clean(doc.document_number),
        'document_expiry': this.get_date(doc.document_expiry),
        'document_issue': this.get_date(doc.document_issue),

        'first_name': names.first_name,
        'last_name': names.last_name[0],
        'second_last_name': names.last_name[1] || '',
        'personal_number': this.clean(doc.personal_number),
        'gender': doc.gender,
        'nationality': this.get_country(doc.nationality),
        'birth_date': this.get_date(doc.birth_date),

        'valid': {}
    };

    let valid_doc = true;
    for (let key in doc['check_digits']) {
        if (!doc['check_digits'].hasOwnProperty(key) || !doc.hasOwnProperty(key)) {
            continue;
        }
        let digit = doc['check_digits'][key];
        let value = doc[key];
        let valid = parseInt(digit) === this.check(value);
        new_doc['valid'][key] = valid;
        valid_doc = valid_doc && valid;
    }
    new_doc['valid']['document_valid'] = valid_doc;

    return new_doc;
};
