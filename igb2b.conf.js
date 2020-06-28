/** Created by Mohammad Malikuzzaman (malik.uzzaman@selise.ch) */
/** Configurations */
var config = require("./config/config.json");
const axios = require('axios');
const sendReportMail = config.mailConfig.emailReportSend;

baseUrl = config.credentials.url;
// baseUrl='https://test.essential-sandbox.com/en/';
sleep = 120 * 1000;

const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
const d = new Date();
const datestring =  d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()  + "-"+ d.getHours() + "-" + d.getMinutes();
const reportName='IGB2B-Automation-Test-Report'+datestring;


exports.config = {
    //framework: 'jasmine',

    // seleniumAddress: 'http://selenium-grid.seliselocal.com/wd/hub',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // directConnect: true,
    multiCapabilities: [{
        'browserName': 'chrome',
        // 'name':'igb2b',
        // 'build':'stage',       
        // "screenResolution":"1280x720",
        // "tz" : "Asia/Dhaka",
        'goog:chromeOptions': {
            // 'w3c': false,
            'args': [
                '--start-maximized', // it will not work in headless mode
                // '--start-fullscreen' //  It will not work in headless mode. Specifies if the browser should start in fullscreen mode, like if the user had pressed F11 right after startup.
                //'--headless', // un-comment this line to run in headless mode
                // '--disable-gpu',
                // '--window-size=1920,1080'
            ],
        }
        
    }],
    
    specs: [

        /** 4 type of membership Application Creation, Search, Start Review and Accept   */
        './specs/membershipBrokerCreationSearchStartReview.spec.js',
        // './specs/membershipInsurerCreationSearchStartReview.spec.js',
        // './specs/membershipSoftwareProviderCreationSearchStartReview.spec.js',
        // './specs/membershipStrategicPartnerCreationSearchStartReview.spec.js',
            
        /** this is for permissionGroup create and search the permission group */
        // './specs/permissionGroupCreationAndSearch.spec.js',
        
        // /** Creating a Permission and Search */
        // './specs/permissionCreationAndSearch.spec.js',
        
        
        // './specs/memberImpersonateUser.spec.js' ,
        /**
            > Login as Admin > Impersonate > 
            > create a service provider
            > search the service provider
            > create a service agreement > 
            > search the service agreement
            > Logout 
        */
        /** this is for creating an user and search the user */
        // './specs/userCreation.spec.js',
        
    ],
    // beforeLaunch:()=>{
    //     return axios.post('http://localhost:3000/app', {
    //       Name: 'igb2b',
    //       Code: 2
    //     })
    //     .then(function (response) {
    //       console.log(response.data);
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    //   },
    

    onPrepare: function() {

        /** Global Variables */
        global.igadminEmail = config.credentials.email;
        global.pass = config.credentials.pass;
        global.EC = protractor.ExpectedConditions;
  
        ////////// Jasmine SpecReporter
        const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
        jasmine.getEnv().addReporter(new SpecReporter({
          displayFailuresSummary: true,
          displayFailedSpec: true,
          displaySuiteNumber: true,
          displaySpecDuration: true,
          displayStacktrace: true,
          spec: {
            displayStacktrace: true
          },
          summary: {
            displayDuration: false
          }
        }));
            
        ////*************Jasmine Reporter to generate xml**************//////
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: './test-reports/',
        filePrefix: reportName
            //filePrefix: 'xmlresults'
        }));


        /** Protractor beautiful Reporter */
        const HtmlReporter = require('protractor-beautiful-reporter');
        // Add a screenshot reporter and store screenshots to `/tmp/screenshots`:
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: 'tmp/screenshots',
            docTitle: 'IGB2B Automation Test',
            docName: 'index.html',
            preserveDirectory: false,
            //cssOverrideFile: 'css/style.css',
            screenshotsSubfolder: 'images',
            jsonsSubfolder: 'jsons',
            takeScreenShotsOnlyForFailedSpecs: true,
            excludeSkippedSpecs: true,
            sortFunction: function sortFunction(a, b) {
                if (a.instanceId < b.instanceId) return -1;
                else if (a.instanceId > b.instanceId) return 1;

                if (a.timestamp < b.timestamp) return -1;
                else if (a.timestamp > b.timestamp) return 1;

                return 0;
            },
            clientDefaults: {
                searchSettings: {
                    allselected: false,
                    passed: false,
                    failed: true,
                    pending: true,
                    withLog: true
                },
                columnSettings: {
                    displayTime: true,
                    displayBrowser: false,
                    displaySessionId: false,
                    displayOS: false,
                    inlineScreenshots: false
                }
            }
          }).getJasmine2Reporter());
  
  
    },

    onComplete: function() {
    // **********protractor HTML Reporter  **********************
            // https://www.npmjs.com/package/protractor-html-reporter

        var browserName, browserVersion;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');

            var HTMLReport = require('protractor-html-reporter');

            testConfig = {
            reportTitle: reportName,
            outputPath: './test-reports/',
            //screenshotPath: './screenshots',
            testBrowser: browserName,
            browserVersion: browserVersion,
            modifiedSuiteName: false,
            screenshotsOnlyOnFailure: true
            };

            new HTMLReport().from('./test-reports/'+reportName+'.xml', testConfig);

            //new HTMLReport().from('./test-reports/xmlresults.xml', testConfig);
        });
    },

    onCleanUp: function(exitCode){
        // mailListener.stop();
        console.log('\nOnCleanUp:---- Exit Code is :', exitCode);
    },

    afterLaunch: function(exitCode){

        console.log('\nafterLaunch:----  Exit Code is::',exitCode);

        //const sendReportMail = 0;
        // axios.post('http://localhost:3000/app', {
        //     Name: 'igb2b',
        //     Code: exitCode
        //   })
        //   .then((response)=> {
        //     console.log(response.data);
           
           
        //   })
        //   .catch(function (error) {
        //     console.log(error);
           
        //   });

        if(sendReportMail === true){

            // Node mailer  to send email the test report
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                
                service: config.mailConfig.service,
                port: config.mailConfig.port, //587, //465,
                secure: true, //false,// // use SSL, false for 587 or any other port, true for port: 465
                auth: {
                    user: config.mailConfig.user,
                    pass: config.mailConfig.pass
                }
            });

            var attach = [
                {   // file on disk as an attachment
                    //filename: reportName+'.html',
                    filename: reportName + 'chrome-test-report.html',
                    //path: './test-reports/'+reportName+'.html'// stream this file
                    path: './test-reports/chrome-test-report.html'// stream this file
                }
            ];


            if(exitCode!=0 ){

                // Node mailer  to send email the test report //
                return new Promise(function (fulfill, reject){
                    var mailOptions = {
                        from: '"Test Report On Fail" <' + config.mailConfig.user +'>', // sender address (who sends)
                        to: config.mailConfig.mailReceivers.join(','), // list of receivers (who receives)
                        subject: 'Automation Test Failed', // Subject line
                        html: '<strong>Aoutomation Test failed'+'</strong><strong> for some reason </strong><br> Please check the attached report', // html body

                        attachments: attach
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            //reject(error);
                            return console.log(error);
                        }
                        fulfill(info);
                    });
                });

            }


            if(exitCode==0 ) {

                return new Promise(function (fulfill, reject) {

                    var mailOptions = {
                        from: '"Test Report On Success" <' + config.mailConfig.user +'>', // sender address (who sends)
                        to: config.mailConfig.mailReceivers.join(','), // list of receivers (who receives)
                        subject: 'Automation Test Success', // Subject line
                        html: '<strong>Aoutomation Test success'+'</strong><strong> Test passed successfully </strong><br> Please check the attached report', // html body

                        attachments: attach
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            //reject(error);
                            return console.log(error);
                        }
                        fulfill(info);
                    });
                });
            }

        } else {console.log('No need to send mail.');}

    },

    framework: 'jasmine2',
        jasmineNodeOpts: {    
            showColors: true,
            silent: true,
            defaultTimeoutInterval: 600*1000,
            print: function() {
                
            },
            // isVerbose: true,
            // realtimeFailure: true,
            includeStackTrace: true
        
        },

    SELENIUM_PROMISE_MANAGER: false, // need to set it 'false' if using async/await 
    allScriptsTimeout: 600*1000,


};
