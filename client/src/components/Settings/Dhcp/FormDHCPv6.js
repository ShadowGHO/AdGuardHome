import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { useTranslation } from 'react-i18next';

import {
    renderInputField,
    toNumber,
} from '../../../helpers/form';
import { FORM_NAME } from '../../../helpers/constants';
import {
    validateIpv6,
    validateIsPositiveValue,
    validateRequiredValue,
} from '../../../helpers/validators';

const FormDHCPv6 = ({
    handleSubmit,
    submitting,
    processingConfig,
    ipv6placeholders,
    isInterfaceIncludesIpv6,
}) => {
    const { t } = useTranslation();
    const dhcpv6 = useSelector((state) => state.form[FORM_NAME.DHCPv6]);
    const v6 = dhcpv6?.values?.v6 ?? {};
    const dhcpv6Errors = dhcpv6?.syncErrors;

    const dhcpInterfaces = useSelector((state) => state.form[FORM_NAME.DHCP_INTERFACES]);
    const interface_name = dhcpInterfaces?.values?.interface_name;

    const dhcpInterfacesErrors = dhcpInterfaces?.syncErrors;
    const invalid = !interface_name || dhcpv6Errors || dhcpInterfacesErrors;

    const validateRequired = useCallback((value) => {
        if (!Object.values(v6)
            .some(Boolean)) {
            return undefined;
        }
        return validateRequiredValue(value);
    }, [Object.values(v6)
        .some(Boolean)]);


    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-lg-12">
                <div className="form__group form__group--settings">
                    <div className="row">
                        <div className="col-12">
                            <label>{t('dhcp_form_range_title')}</label>
                        </div>
                        <div className="col">
                            <Field
                                name="v6.range_start"
                                component={renderInputField}
                                type="text"
                                className="form-control"
                                placeholder={t(ipv6placeholders.range_start)}
                                validate={[validateIpv6, validateRequired]}
                                disabled={!isInterfaceIncludesIpv6}
                            />
                        </div>
                        <div className="col">
                            <Field
                                name="v6.range_end"
                                component="input"
                                type="text"
                                className="form-control disabled cursor--not-allowed"
                                placeholder={t(ipv6placeholders.range_end)}
                                value={t(ipv6placeholders.range_end)}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-6 form__group form__group--settings">
                <label>{t('dhcp_form_lease_title')}</label>
                <Field
                    name="v6.lease_duration"
                    component={renderInputField}
                    type="number"
                    className="form-control"
                    placeholder={t(ipv6placeholders.lease_duration)}
                    validate={[validateIsPositiveValue, validateRequired]}
                    normalizeOnBlur={toNumber}
                    min={0}
                    disabled={!isInterfaceIncludesIpv6}
                />
            </div>
        </div>
        <div className="btn-list">
            <button
                type="submit"
                className="btn btn-success btn-standard"
                disabled={submitting || invalid || processingConfig || !isInterfaceIncludesIpv6}
            >
                {t('save_config')}
            </button>
        </div>
    </form>;
};

FormDHCPv6.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    processingConfig: PropTypes.bool.isRequired,
    change: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    ipv6placeholders: PropTypes.object.isRequired,
    isInterfaceIncludesIpv6: PropTypes.bool.isRequired,
};

export default reduxForm({
    form: FORM_NAME.DHCPv6,
})(FormDHCPv6);
