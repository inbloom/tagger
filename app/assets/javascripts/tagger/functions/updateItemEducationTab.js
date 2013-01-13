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

function updateItemEducationTab(nameBox, nameInput){

    $("#multiItemSelector input[type=checkbox]:checked").each(function(i,obj) {
        var found = false;
        var LRMIForm = document.forms.LRMIData;
        var metaSourceValue = "";
        var x = 0;
        for (x=0;x<LRMIForm[nameBox].length;x++) {
            if (LRMIForm[nameBox][x].selected) {
                if (found) {
                    metaSourceValue = metaSourceValue + "," + LRMIForm[nameBox][x].value;
                }
                else {
                    metaSourceValue = LRMIForm[nameBox][x].value;
                    found = true;
                }
            }
        }
        if (LRMIForm[nameInput].value != ''){
            metaSourceValue = metaSourceValue + "," + LRMIForm[nameInput].value;
        }
        items[obj.id][nameBox] = metaSourceValue;
    });

    updateTextArea();
}
