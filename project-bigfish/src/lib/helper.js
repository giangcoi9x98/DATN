const fs = require('fs')
const path = require('path')
const Decimal = require('decimal.js')
const {SecondByPeriod, PaymentPeriodShorthand, PaymentPeriod, ShortPeriodTerm, DayByPeriod} = require('./common')
const paymentFreqByYear = {
    Day: 365,
    Month: 12,
    Quarter: 4,
    Semiannual: 2,
    Annual: 1,
    Year: 1,
    End: 0,
}

function calculateYtm({face_value, coupon_rate, coupon_payment_period, term, term_by, current_price, coupon_rate_by = 'y'}) {
    coupon_rate_by = coupon_rate_by || 'y'
    const facevalue = face_value;
    const currentvalue = current_price;
    const MulCouponRate = {
        y: 1,
        m: 12,
        d: 365.25,
        s: 2,
        q: 3,
        a: 1,
        sa: 2
    }
    const _yield = coupon_rate * MulCouponRate[coupon_rate_by];
    const periodicFreq = paymentFreqByYear[coupon_payment_period]
    const years = (term * SecondByPeriod[term_by]) / SecondByPeriod['y'];
    const paymentinterval = coupon_payment_period;
    let numberpaymentscompute, yieldcompute, adjust;
    adjust = SecondByPeriod[term_by]/SecondByPeriod[PaymentPeriodShorthand[coupon_payment_period]]
    // console.log(SecondByPeriod[PaymentPeriodShorthand[coupon_payment_period]],SecondByPeriod[term_by],PaymentPeriodShorthand[coupon_payment_period],coupon_payment_period)
    if (paymentinterval === PaymentPeriod.Annual) {
        numberpaymentscompute = years;
        yieldcompute = _yield;
        // adjust = 1;
    } else if (paymentinterval === PaymentPeriod.Semiannual) {
        numberpaymentscompute = years * 2;
        yieldcompute = _yield / 2;
        // adjust = 2;
    } else if (paymentinterval === PaymentPeriod.Quarter) {
        numberpaymentscompute = years * 4;
        yieldcompute = _yield / 4;
        // adjust = 4;
    } else if (paymentinterval === PaymentPeriod.Month) {
        numberpaymentscompute = years * 12;
        yieldcompute = _yield /12;
        // adjust = 12;
    } else if (paymentinterval === PaymentPeriod.Day) {
        numberpaymentscompute = years * 365;
        yieldcompute = _yield /365;
        // adjust = 365;
    }
    // numberpaymentscompute = Math.round(numberpaymentscompute)
    // console.log(_yield, yieldcompute, adjust, numberpaymentscompute, years)




    // let currentyield = (facevalue * yieldcompute / 100) / currentvalue; // discount amount
    //
    // currentyield = currentyield * 100;
    //
    // currentyield = Math.round(currentyield * 10000) / 10000;
    // currentyield = currentyield.toString().concat('%');
    // form.currentyield.value = currentyield;

    // compute _yield to maturity

    //var nper = 4;
    //var pmt = 70; //

    // var pv = -950;

    //var  fv = 1000;
    var type = 0;
    var guess = 0.1;

    var nper = numberpaymentscompute;

    var pmt = facevalue * (yieldcompute / 100);

    var pv = currentvalue * -1;


    var fv = facevalue * 1;


    var rate = guess;


    var f;
    var x0;
    var x1;
    var y0;
    var y1;
    var y;

    if (Math.abs(rate) < .000000001) {
        y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
    } else {
        f = Math.exp(nper * Math.log(1 + rate));
        y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
    }
    y0 = pv + pmt * nper + fv;
    y1 = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;

    // find root by secant method
    var i = x0 = 0.0;
    x1 = rate;
    while ((Math.abs(y0 - y1) > .000000001) && (i < 128)) {
        rate = (y1 * x0 - y0 * x1) / (y1 - y0);
        x0 = x1;
        x1 = rate;

        if (Math.abs(rate) < .000000001) {
            y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
        } else {
            f = Math.exp(nper * Math.log(1 + rate));
            y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
        }

        y0 = y1;
        y1 = y;
        ++i;

    }
    let maturityyield = rate * adjust;

    maturityyield = maturityyield * 100;

    maturityyield = Math.round(maturityyield * 100) / 100;
    // maturityyield = maturityyield.toString().concat('%');

    return maturityyield //> 1 ? maturityyield : estYTM(years, face_value, (face_value*(coupon_rate/100))/periodicFreq, current_price) * 100
}

function totalPaymentPeriod(bondData){
    return Math.round( (bondData.term * SecondByPeriod[bondData.term_by]) / (SecondByPeriod[PaymentPeriodShorthand[bondData.coupon_payment_period]])) || 0
}

function isAbleToMature(bondData, current_payment_cycle_id){
    current_payment_cycle_id = current_payment_cycle_id || bondData.last_payment_cycle_id + 1
    return totalPaymentPeriod(bondData) <= current_payment_cycle_id
}

/**
 *
 * @param {Object} bondData
 * @param {boolean} justCoupon is require to check mature, if mature plus the face amount to coupon amount
 * @param {number} interest_fee
 * @param {boolean} current_payment_cycle_id
 * @returns {number[]} result: [amountAfterFees, feesAmount, amountNoFee]
 */
function calculateCouponAmount(bondData, justCoupon=false, interest_fee = 0, current_payment_cycle_id){
    // console.log(totalPaymentPeriod(bondData) , bondData.last_payment_cycle_id >= totalPaymentPeriod(bondData) - 1)
    let c = new Decimal(
        (DayByPeriod[PaymentPeriodShorthand[bondData.coupon_payment_period]] / DayByPeriod[bondData.coupon_rate_by || 'y'])
        *
        (bondData.coupon_rate/100)
    )
        .mul(bondData.face_value)
        .mul(bondData.total_supply)
    //interest service fee, issuer must to paid
    const feeAmount = c.mul(interest_fee/100)
    const rawAmountNoFee = c.toNumber()
    c = c.add(feeAmount)
    c = c.add(justCoupon ? 0 : (isAbleToMature(bondData, current_payment_cycle_id) ? Decimal.mul(bondData.face_value, bondData.total_supply) : 0))
    return [c.toNumber(), feeAmount.toNumber(), rawAmountNoFee]
}

function requireEmailTemplate(templateName, data = {}){
    let content = fs.readFileSync(path.resolve(__dirname, `../email_templates/${templateName}.html`), 'utf8');
    Object.keys(data).forEach((key) => {
        const regex = new RegExp(`%${key}%`, 'g')
        content = content.replace(regex, data[key]);
    });
    return content;
}

module.exports = {
    calculateYtm,
    calculateCouponAmount,
    isAbleToMature,
    totalPaymentPeriod,
    requireEmailTemplate
}
