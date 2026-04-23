const ratelimit=require("express-rate-limit");

const limiter=ratelimit({
    windowMs:15*60*1000,
    max:15,
    message:{
        msg:"Too many login attempts.Try again after 15 minutes",
        success:false
    },
    standardHeaders:true,
    legacyHeaders:false
});

const GeneralLimiter=ratelimit({
    windowMs:15*60*1000,
    max:100,
    message:{
        msg:"Too many attempts.Try again after 15 minutes",
        success:false
    },
    standardHeaders:true,
    legacyHeaders:false
});

module.exports={limiter,GeneralLimiter};