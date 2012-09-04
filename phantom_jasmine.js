var system = require('system');

if (system.args.length !== 2) {
    console.log('Usage: run-jasmine.js URL');
    phantom.exit(1);
}

var page = new WebPage();

// Set the URL. Note: for local files, format is: file://localhost/Users/richquick/Dropbox/github/js_test/spec/spec_runner.html where file://localhost/ is the same for any path
var url = system.args[1];

phantom.viewportSize = {width: 800, height: 600};
// Show up the console messages form that page by default
page.onConsoleMessage = function (msg) { console.log(msg); };
//Open the website
page.open(url, function (status) {
    //Page is loaded!
        if (status !== 'success') {
                console.log('fail');
                phantom.exit();
            } else {
                 //Using a delay to make sure the JavaScript is executed in the browser
               window.setTimeout(function () {
                    result = page.evaluate(function () {
                        $failing_messages = $('.specSummary.failed .description');
                        if ($failing_messages.length < 1) {
                          return 'alert_has_passed';
                        } else {
                          failure_return = 'You have: ' + $failing_messages.length + ' failure(s)LINE_END' ;
                          $failing_messages.each(function(index) {
                          	failure_return += $(this).attr("title") + 'LINE_END';
                          });
                          return failure_return;
						}
					});
                    console.log(result);
                    phantom.exit();
               }, 1000);
         }
});
