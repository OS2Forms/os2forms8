exports.config = {
    tests: './scenarios/**/*_test.js',
    output: './output',
    timeout:100000,
    helpers: {
        TestCafe : {
            url: "http://drupal",
            waitForTimeout: 15000,
            show: true,
            browser: "chrome"
        }
    },
    bootstrap: null,
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: "-",
                options: {
                    debug: true
                }
            },
        }
    },
    name: 'codeceptjs',
}
