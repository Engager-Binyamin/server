
require('dotenv').config();
const campaignController = require("../DL/controllers/campaign.controller");
const leadController = require("../DL/controllers/lead.controller");

const campaignModel = require('./models/campaign.model');


const go2 = async () => {
    const db = require('./db')
    db.connect()
    const auth = require("../middlewares/auth")

    let objCamp = {
        user: "65ed9c525b51ed6b4bd16107",
        title: "כפר נוער - גיוס תלמידים",
        details: "כל המנויים שנרשמו דרך מזכירות מטה בנימין",
        msg: [
            {
                subject: "הודעה ראשונה - התנעה",
                content: "חלק ממרכזי המחוננים מפעילים תוכניות לתלמידים מצטיינים לתלמידים שהישגיהם במבחני הקבלה לתוכניות המחוננים היו בתחום ה-5% הגבוהים ביותר אחרי סף הקבלה לתוכנית המחוננים באזורם. הורי התלמידים המשתייכים לקבוצה זו יקבלו על כך הודעה בכתב ובה פרטי התקשרות עם מנהל התוכנית למצטיינים. התוכנית מיועדת לתלמידי כיתות ג'–ו'. היא פועלת יום בשבוע לאחר שעות הלימודים וכוללת שני קורסים מתחומי ידע שונים שאינם כלולים בתוכנית הלימודים הפורמלית. ההשתתפות בתוכנית כרוכה בתשלום הורים, וההסעות אליה הן באחריות ההורים.",
                creationDate: new Date("2024-01-06"),
                status: "sent",
                isZeroMsg: true
            },
            {
                subject: "יום פתוח",
                content: "יום פתוח, יתקיים ביום שישי, 1.3.24, בשעה 09:30 בבוקר.            תוכלו להירשם דרך טופס ההרשמה (עכשיו הירשמו) הנמצא בכל דפי האתר.",
                creationDate: new Date("2024-01-22"),
                status: "sent",
            },
            {
                subject: "הזדמנות אחרונה להירשם",
                content: "הזדמנות אחרונה להירשם! קורס עיצוב תיק דוקטור עם אלה עלוש ⏰משך הקורס: 6 מפגשים בני 4 שעות. ⏳תאריך פתיחה: 19/1 ימים ושעות: ימי חמישי",
                creationDate: new Date("2024-02-08"),
                status: "created",
            }
        ],

        leads: [
            {
                fullName: "משה כהן",
                email: "Moshe@Test.co.il",
                phone: "05067378855",
                joinDate: new Date("2024-02-08"),
                extra: {
                    age: {
                        he: "גיל",
                        value: "22"
                    },
                    class: {
                        he: "חוג",
                        value: "אילוף אריות אסייאתים"
                    }
                }
            },
            {
                fullName: "חיים לוי",
                email: "haim1212@gmail.com",
                phone: "05012332185",
                joinDate: new Date("2024-02-01"),
            }, {
                fullName: "טל פורטל",
                email: "talp@walla.com",
                phone: "05456253555",
                joinDate: new Date("2024-02-08"),
            }, {
                fullName: "רונית מזרחי",
                email: "ronitmiz@gmail.com",
                phone: "0534254351",
                joinDate: new Date("2024-03-08"),
            }, {
                fullName: "בר משומר",
                email: "inbrai@lomi.com",
                phone: "0504587512",
                extra: {
                    age: {
                        he: "גיל",
                        value: "8"
                    }
                    ,
                    class: {
                        he: "חוג",
                        value: " אילוף דגים לקפיצה לגובה"
                    }
                },

                joinDate: new Date("2024-01-18"),
            }

        ],
    }

    let camp = await campaignModel.create(objCamp)

    let rcm = []
    camp.leads.forEach(l => rcm.push({
        leadId: l._id,
        msgId: camp.msg[0]._id,
        status: "sent"
    }))
    let rcm2 = [
        { leadId: camp.leads[0]._id, msgId: camp.msg[1]._id, status: "sent" },
        { leadId: camp.leads[1]._id, msgId: camp.msg[2]._id, status: "sent" },
    ]
    camp.receivedMsgs = [...rcm, ...rcm2]
    camp.webhook = await auth.createToken(camp._id, camp.user)

    await camp.save()

    let objCamp2 = {
        user: "65ed9c525b51ed6b4bd16107",
        title: "מנויי חדר כושר בנימין",
        details: "כל המנויים שנרשמו דרך מזכירות מטה בנימין",
        msg: [{
            subject: "הודעה ראשונה - ההרשמה נפתחה",
            content: "סתכל על עצמך רגע! אתה בטוח שזה לא יכול להראות טוב יותר? שאתה לא יכול להרגיש טוב יותר? זה זמן לשינוי. מועדון הכושר שלנו מציע תוכניות מותאמות אישית לכל רמת כושר ומטרה. אנחנו מאמינים שכולם יכולים להגיע לחזונותיהם, ואנחנו כאן להכווין אותך כל הדרך. אם אתה מחפש להשיג גוף חזק יותר, להרגיש בריא יותר, להגביר את מסת השריר, או אפילו פשוט לשפר את מצב הרוח - יש לנו את מה שאתה צריך.",
            creationDate: new Date("2024-02-06"),
            status: "sent",
            isZeroMsg: true
        },
        {
            subject: "הודעה ראשונה - תראו מה כותבים עלינו",
            content: "אנחנו אוהבים תמונות ואנשים, יש לנו ניסיון עשיר בהדפסת תמונות על מגוון רעיונות ועיצובים, יש לנו מגוון רחב של מתנות עם תמונה לאוהבים שלכם, או לעצמכם, טיילו באתר ותהנו. ",
            creationDate: new Date("2024-02-02"),
            status: "sent",
        },
        {
            subject: "הזדמנות אחרונה להירשם",
            content: "הזדמנות אחרונה להירשם! קורס עיצוב תיק דוקטור עם אלה עלוש ⏰משך הקורס: 6 מפגשים בני 4 שעות. ⏳תאריך פתיחה: 19/1 ימים ושעות: ימי חמישי",
            creationDate: new Date("2024-02-08"),
            status: "created",
        }
        ],

        leads: [
            {
                fullName: "מור שחר",
                email: "Moshe@Test.co.il",
                phone: "0506772855",
                joinDate: new Date("2024-02-08"),
                extra: {
                    fruit: {
                        he: "פרי אהוב",
                        value: "בננה"
                    },
                    beverage: {
                        he: "משקה אהוב",
                        value: "תמר הינדי"
                    }
                    , hobby: {
                        he: "תחביב",
                        value: "כדורגל"
                    }
                }
            },
            {
                fullName: "ליחי אמסלם",
                email: "haim1212@gmail.com",
                phone: "0501233185",
                joinDate: new Date("2024-02-01"),
            }, {
                fullName: "רון דרימר",
                email: "talp@walla.com",
                phone: "05456253551",
                joinDate: new Date("2024-02-08"),
            }, {
                fullName: "מרדכי עמיר",
                email: "amir1212@gmail.com",
                phone: "0522145351",
                joinDate: new Date("2022-01-01"),
                extra: {
                    fruit: {
                        he: "פרי אהוב",
                        value: "תותים"
                    }
                    ,
                    beverage: {
                        he: "משקה אהוב",
                        value: "קולה"
                    }
                    , hobby: {
                        he: "תחביב",
                        value: "כדורסל"
                    }


                }
            },
            {
                fullName: "ורד ניסן",
                email: "vered@gmail.com",
                phone: "0531211251",
                joinDate: new Date("2021-03-08"),
                extra: {
                    fruit: {
                        he: "פרי אהוב",
                        value: "אנונה"
                    }
                    ,
                    beverage: {
                        he: "משקה אהוב",
                        value: "מירנדה"
                    }
                    , hobby: {
                        he: "תחביב",
                        value: "קונצרטים באוזניות"
                    }

                }
            },
        ],
    }
    let camp2 = await campaignModel.create(objCamp2)

    rcm = []
    camp2.leads.forEach(l => rcm.push({
        leadId: l._id,
        msgId: camp2.msg[0]._id,
        status: "sent"
    }))
    rcm2 = [
        { leadId: camp2.leads[0]._id, msgId: camp2.msg[1]._id, status: "sent" },
        { leadId: camp2.leads[1]._id, msgId: camp2.msg[2]._id, status: "sent" },
    ]
    camp2.receivedMsgs = [...rcm, ...rcm2]
    camp2.webhook = await auth.createToken(camp2._id, camp2.user)

    await camp2.save()

    console.log("Doneeeeeee");
};

go2()