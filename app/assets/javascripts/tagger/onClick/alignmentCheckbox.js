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

$(function() {

    $(".alignment-checkbox").live('click', function(evt) {

        checkbox = evt.target
        objectHash = $(checkbox).attr('value');

        $("#multiItemSelector input[type=checkbox]:checked").each(function(i,obj) {

            if ($(checkbox).is(':checked')) {
                items[obj.id].educationalAlignments[objectHash] = alignments[objectHash];
            } else {
                delete items[obj.id].educationalAlignments[objectHash];
            }

        });

        updateTextArea();
    });

});