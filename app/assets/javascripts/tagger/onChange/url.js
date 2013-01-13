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

    var objName = "url"

    $("#"+objName).change(function(obj){
        var metaSourceValue = $(obj.target).val();

        $("#multiItemSelector input[type=checkbox]:checked").each(function(i,obj) {
            items[obj.id][objName] = metaSourceValue;
            if (metaSourceValue != "") {
                $("#"+obj.id+"URL").show();
            } else {
                $("#"+obj.id+"URL").hide();
            }

        });

        updateTextArea();
        updateMainContentBottom(metaSourceValue);
    });

});