/*
 * grunt-init-guardian-interactive
 *
 * Copyright (c) 2015 Guardian News & Media Ltd
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Guardian interactive template.';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'Project name should start with interactive- to distinguish ' +
'it from other projects on the Guardian github repo.';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. After that, you may start the project '+
  'with _grunt_.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    init.prompt('name', 'interactive-news-story'),
    init.prompt('description', 'Guardian interactive project.'),
    init.prompt('repository'),
    init.prompt('author_name'),
    init.prompt('licenses', 'Apache-2.0'),
    init.prompt('s3_path', 'testing/uk/example/')
  ], function(err, props) {

    props.keywords = ['guardian', 'interactive', 'visuals'];

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: 'src/imgs/**'});
    
    // Write sample aws.json
    var awsCfg = { "AWSAccessKeyID": "AKxxxxxxxxxx", "AWSSecretKey":   "super-secret-key" };
    grunt.file.write('cfg/aws.json', JSON.stringify(awsCfg, null, '  '));

    // All done!
    done();
  });

};
