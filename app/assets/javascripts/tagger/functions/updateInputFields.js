/*
 * Copyright 2012-2013 inBloom, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function updateInputFields(){
    updateResourceCount();
    // Disable the publish button
    $("#publishButton").addClass('disabled');
    // Clear form data
    $("form[name=LRMIData]").find("input[type=text], textarea, select").val("");
    // Clear alignment tabs
    $("#currentAlignmentTable input[type=checkbox]").attr('checked', false);
    // Clear the iframe
    updateMainContentBottom();
    // Update form enabled/disabled state
    toggleForm();
    // If only one is selected then update the form with that one
    if ($("#multiItemSelector input[type=checkbox]:checked").length == 1) {

        // Enable the publish button
        $("#publishButton").removeClass('disabled');

        var item = items[$("#multiItemSelector input[type=checkbox]:checked").first().attr('id')];

        //Setup General Tab for Single Selection
        if (item.title != "")                         $("#title").val(item.title);
        if (item.url != "")                           $("#url").val(item.url);
        if (item.language != "")                      $("#language").val(item.language);
        if (item.topic != "")                         $("#topic").val(item.topic);
        if (item.createdBy != "")                     $("#createdBy").val(item.createdBy);
        if (item.usageRightsURL != "")                $("#usageRightsURL").val(item.usageRightsURL);
        if (item.publisher != "")                     $("#publisher").val(item.publisher);
        if (item.isBasedOnURL != "")                  $("#isBasedOnURL").val(item.isBasedOnURL);
        
        d = new Date();
        var curr_day = ('0' + d.getDate()).slice(-2);
        var curr_month = d.getMonth()+1;
        var curr_year = d.getFullYear();
        ds = curr_year + "-" + curr_month + "-" + curr_day;
        
        if (item.createdOn != "") {
          $("#createdOn").val(item.createdOn);
        } else {
          $("#createdOn").val(ds);
        }

        // Refactoring timeRequired update -- why are we using this format?
        if (item.timeRequired != "P0Y0M0W0DT0H0M0S") {
            var vals = item['timeRequired'].match(/(\d+)/g);

            updateSlider(event, ui, $("#slideryears"), 'Year', vals[0]);
            updateSlider(event, ui, $("#slidermonths"), 'Month', vals[1]);
            updateSlider(event, ui, $("#sliderweeks"), 'Week', vals[2]);
            updateSlider(event, ui, $("#sliderdays"), 'Day', vals[3]);
            updateSlider(event, ui, $("#sliderhours"), 'Hour', vals[4]);
            updateSlider(event, ui, $("#sliderminutes"), 'Minute', vals[5]);
            updateSlider(event, ui, $("#sliderseconds"), 'Second', vals[6]);
        }

        // Stuff the iframe
        if (item.url != "") updateMainContentBottom(item.url);

        //Setup Education Tab for Single Selection
        setupDisplayFieldsEducationTab(item, 'endUser');
        setupDisplayFieldsEducationTab(item, 'ageRange');
        setupDisplayFieldsEducationTab(item, 'educationalUse');
        setupDisplayFieldsEducationTab(item, 'interactivityType');
        setupDisplayFieldsEducationTab(item, 'learningResourceType');
        setupDisplayFieldsEducationTab(item, 'mediaType');
        setupDisplayFieldsEducationTab(item, 'groupType');

        for (j in item.educationalAlignments) {
            $("input[type=checkbox][value="+j+"]").attr('checked',true);
        }
        // If only one is selected then update the form with that one
    } else if ($("#multiItemSelector input[type=checkbox]:checked").length > 1) {
        // Enable the publish button
        $("#publishButton").removeClass('disabled');
    } else {
        // Clear the time required sliders as they are special
        clearTimeRequired();
    }
}
