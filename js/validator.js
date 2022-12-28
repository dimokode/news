;(function(){

function validator(){}


function getFormValidationRules(formValidationRules){
    formValidation = {};

    for(let elId in formValidationRules){
        let validateString = formValidationRules[elId]['elRules'],
            elValue = formValidationRules[elId]['elValue'];
        if(validateString){
            let validateFunctions = validateString.split(';');
            let validFuncNr = 0;
            formValidation[elId] = {};
            validateFunctions.forEach(function(validFunc){
            
                if(validFunc != ''){//isFunc(arg)
                    console.log(validFuncNr);
                    
                    let matches = /(.*)\((.*)\)/.exec(validFunc);
                    let validFunctionName = matches[1];
                    let validFunctionArgs = matches[2].indexOf(',') ? matches[2].split(',') : matches[2];
                    console.log(validFunctionName + '=>' + validFunctionArgs);
                    let validatorObj = new Validator(elValue);
                    let validResult = validatorObj[validFunctionName](...validFunctionArgs);
                    if(validResult === true){
                        console.log('Validation ok');
                        formValidation[elId][validFuncNr] = true;
                    }else{
                        formValidation[elId][validFuncNr] = validResult;
                        console.log(validResult);
                    }
                    validFuncNr++;
                }
            });
            //console.log(formValidation);
        }
    }
    return formValidation;
}

function showValidationResults(validationResults){
    let validationResult = true;
    $('.validation_error').removeClass('validation_error');
    $('div.validation_error_msg').remove();
    for(let elId in validationResults){
        for(let ruleIndex in validationResults[elId]){
            if(validationResults[elId][ruleIndex] !== true){
                validationResult = false;
                $('#'+elId).parent('div').addClass('validation_error')
                .append(`<div class="validation_error_msg">${validationResults[elId][ruleIndex]}</div>`)
                .parent('groupitem')
                .attr('validation-error', true)
                .parent('section-body').parent('section-group')
                .attr('validation-error', true);

                break;//for each element should be shown first validation error only
            }
        }
    }

    /** open closed groupitems if validation error presents inside */
    $('groupitem[validation-error]').children('button.collapse[status="closed"]').click();


    return validationResult;
}

validator.getFormValidationRules = getFormValidationRules;
validator.showValidationResults = showValidationResults;
window.validator = validator;

})();