(function ( $ ) {

    $.fn.select2related = function(action, relatedobjs=[]) {
    /**
        [{ 'id': '#myfield',
          'url': '/myendpoint', * ignored on simple
          'start_empty': true   * only on related action
        }]
    **/
        this.relatedobjs = relatedobjs;
        let parent = this;
        function get_selected_values(obj){
            var data = [];
            $.each(obj, function(i, e){
                if(e.value != "") data.push(e.value);
            });
            return data.join(',');
        }

        if(action === "simple"){
            for(let x=0; x<this.relatedobjs.length; x++){
                $(this.relatedobjs[x]['id']).select2();
            }
        }

        if(action === 'remote'){
            for(let x=0; x<this.relatedobjs.length; x++){
                $(this.relatedobjs[x]['id']).select2({
                      placeholder: 'Select an element',
                      ajax: {
                        url: this.relatedobjs[x]['url'],
                        type: 'GET',
                        dataType: 'json',
                        data: function (params) {
                              return {
                                selected: get_selected_values($(parent.relatedobjs[x]['id']).find(':selected')),
                                term: params.term,
                                page: params.page || 1
                              }
                        },
                      }
                });
            }
        }
        if(action === "related"){
            for(let x=1; x<this.relatedobjs.length; x++){
                let newselect = $(this.relatedobjs[x]['id']).select2({
                  placeholder: 'Select an element',
                  ajax: {
                    url: this.relatedobjs[x]['url'],
                    type: 'GET',
                    dataType: 'json',
                    data: function (params) {
                      return {
                        relfield: get_selected_values($(parent.relatedobjs[x-1]['id']).find(':selected')),
                        selected: get_selected_values($(parent.relatedobjs[x]['id']).find(':selected')),
                        term: params.term,
                        page: params.page || 1
                      }
                    },
                  }
                });
                if(parent.relatedobjs[x]['start_empty']){
                    newselect.val(null).trigger('change');
                }
            }

            let newselect = $(this.relatedobjs[0]['id']).select2({
              placeholder: 'Select an element',
              ajax: {
                url: parent.relatedobjs[0]['url'],
                type: 'GET',
                dataType: 'json',
                data: function (params) {
                      return {
                        selected: get_selected_values($(parent.relatedobjs[0]['id']).find(':selected')),
                        term: params.term,
                        page: params.page || 1
                      }
                    },
              }
            });
            if(this.relatedobjs[0]['start_empty']){
                newselect.val(null).trigger('change');
            }
        }
        return this;
    };
}( jQuery ));