###############################################################################
# Copyright 2012-2013 inBloom, Inc. and its affiliates.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
###############################################################################

module LrHelper
  @@user = nil
  @@failures = []

  def self.publish tags, user

    unless user
      @@failures << { :type => :publish, :response => 'ERROR: User not logged in.' }
    end

    if @@failures.empty?

      # Document holder
      documents = []
      # Okay now for each tag, stuff them in the items array inside the request envelope
      tags.each { |tag|

        documents << {
            "TOS" => {
                "submission_TOS" => "http://www.learningregistry.org/information-assurances/open-information-assurances-1-0"
            },
            "active" => true,
            "doc_type" => "resource_data",
            "doc_version" => "0.23.0",
            "identity" => {
              "curator" => "#{user.realm}:#{user.user_id}",
              "submitter" => "inBloom Tagger",
              "signer" => "inBloom Tagger",
              "submitter_type" => "agent"
            },
            "keys" => [ ],
            "payload_placement" => "inline",
            "payload_schema" => [ "schema.org", "LRMI", "application/microdata+json" ],
            "payload_schema_locator" => "http://www.w3.org/TR/2012/WD-microdata-20121025/#converting-html-to-other-formats",
            "resource_data" => {
                "items" => [
                    {
                        "type" => [ "http://schema.org/CreativeWork" ],
                        "id" => tag['uuid'],
                        "properties" => self.convert_to_properties(tag)
                    }
                ]
            },
            "resource_data_type" => "metadata",
            "resource_locator" => "URL Field"
        }

      }

      # Create the request wrapper
      payload = { 'documents' => documents }

      puts payload

#    self.request :publish, payload
    end

    # Now return any failures if we had any
    @@failures
  end

  private

  # The magic man behind the curtain! This is the method that actually auths and then calls the site based on the type of call requested
  # for now there is only one :publish, but I'm sure more will come
  def self.request type, payload
    # OAuth stuff..
    consumer = OAuth::Consumer.new 'agilixtagger@gmail.com', 'kf4ER109bnp8dzK8YzoBkm5EeTF1HV2k', { :site => 'http://lrnode.inbloom.org' }
    token = OAuth::AccessToken.new(consumer, 'node_sign_token', 'qMiy1Mc6NGYeJNX1nP6DBtfWAx1mhZQf')

    # do the request by type!
    case type
      when :publish
        rawResponse = consumer.request(:post, '/publish', token, {}, payload.to_json, { 'Content-Type' => 'application/json' })
    end

  end

  # Take any incoming key and map it to the correct output key (Just keys.. not values)
  # These aren't the FULL keys, just the final part.. Full key would be something like; urn:schema-org:property_type:{foo}
  # Note; This is no longer necessary going to the LR as the connector does it for us.  This used to be required going to the LRI
  #  leaving the code here just incase we do need to eventually uncomment a key mapping and change it..
  def self.remap_key key
    # A list of key mappings to replace
    lri_key_mappings = {
        #'types'                 => 'types',
        #'title'                 => 'name',
        #'url'                   => 'url',
        #'language'              => 'in_language',
        #'createdOn'             => 'date_created',
        #'topic'                 => 'about',
        #'usageRightsURL'        => 'use_rights_url',
        #'publisher'             => 'publisher',
        #'isBasedOnURL'          => 'is_based_on_url',
        #'endUser'               => 'intended_end_user_role',
        #'ageRange'              => 'typical_age_range',
        #'educationalUse'        => 'educational_use',
        #'interactivityType'     => 'interactivity_type',
        #'learningResourceType'  => 'learning_resource_type',
        #'timeRequired'          => 'time_required',
        #'createdBy'             => 'author',
        #'educationalAlignments' => 'educational_alignments',
        #'mediaType'             => 'physical_media_type',
        #'groupType'             => 'group_type'
    }
    return lri_key_mappings[key] if lri_key_mappings[key].present?
    key
  end


  # Private
  # Convert a tag as it comes from the UI into the property object that will go into the transmitted envelope.
  def self.convert_to_properties tag
    props = {}
    alignments = []

    # A list of keys that simply need their values turned into an array
    simpleConvertKeys = ['title','language','url','createdOn','topic','usageRightsURL','isBasedOnURL','timeRequired']
    # Step through all keys and find/use the simple ones -- Easy!
    tag.each { |key,value|
      next unless simpleConvertKeys.include?(key)
      props[key] = [ value ] unless value.empty?
    }

    # A list of keys that are arrays by nature and need their comma delimited list broken out!
    csvConvertKeys = ['endUser','ageRange','educationalUse','interactivityType','learningResourceType','mediaType','groupType']
    tag.each { |key,value|
      next unless csvConvertKeys.include?(key)
      props[key] = value.split(',') unless value.empty?
    }

    # Now for some that take some doing...
    # CreatedBy is the Author so.. its a person
    props['createdBy'] = [ {
        'type' => [ "http://schema.org/Person" ],
        'properties' => {
           'name' => [ tag['createdBy'] ]
        }
    } ] unless tag['createdBy'].empty?

    # Publisher is an organization..
    props['publisher'] = [ {
        'type' => [ "http://schema.org/Organization" ],
        'properties' => {
           'name' => [ tag['publisher'] ]
        }
    } ] unless tag['publisher'].empty?

    # Step through all the alignments sent by the tag and parse them out into an array
    tag['educationalAlignments'].each { |key,value|
      alignments << {
          'type' => [ "http://schema.org/AlignmentObject" ],
          'id' => 'urn:corestandards.org:guid:' + key.upcase,
          'properties' => {
              'name' => [ value['educationalAlignment'] ],
              'alignmentType' => [ value['alignmentType'] ],
              'targetDescription' => [ value['description'] ],
              'targetName' => [ value['dotNotation'] ],
              'targetURL' => [ value['itemURL'] ]
          }
      }
    }
    # Now stuff that alignments array into the props we are building..
    props['educationalAlignments'] = alignments


    # Remap the keys to something that schema.org and the like use
    props = Hash[props.map{|k,v| [self.remap_key(k),v] }]

    props
  end

end

