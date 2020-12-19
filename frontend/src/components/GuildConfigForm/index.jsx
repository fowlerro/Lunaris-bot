import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';

export function GuildConfigForm({history, user, config, updateConfig}) {

    return (
        <Formik initialValues={{prefix: config.prefix}} onSubmit={(values) => {
            updateConfig(values);
        }}>
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <InputText name="prefix" onChange={props.handleChange} defaultValue={config.prefix} />
                    <Button label="Zapisz" type="submit" />
                </form>
            )}
        </Formik>
    )
}