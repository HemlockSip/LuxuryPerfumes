// consentManagement.js
import { LightningElement, api, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import MARKETING_CONSENT_FIELD from '@salesforce/schema/Contact.Marketing_Consent__c';
import PROFILING_CONSENT_FIELD from '@salesforce/schema/Contact.Profiling_Consent__c';
import LAST_UPDATED_FIELD from '@salesforce/schema/Contact.Privacy_Preferences_Last_Updated__c';

export default class ConsentManagement extends LightningElement {
    @api recordId;
    marketingConsent = false;
    profilingConsent = false;
    isLoading = true;
    lastUpdated;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [MARKETING_CONSENT_FIELD, PROFILING_CONSENT_FIELD, LAST_UPDATED_FIELD]
    })
    wiredContact({ error, data }) {
        if (data) {
            this.marketingConsent = data.fields.Marketing_Consent__c.value;
            this.profilingConsent = data.fields.Profiling_Consent__c.value;
            this.lastUpdated = data.fields.Privacy_Preferences_Last_Updated__c.value;
            this.isLoading = false;
        } else if (error) {
            this.handleError(error);
        }
    }

    async handleConsentChange(event) {
        const { name, checked } = event.target;
        
        try {
            const fields = {
                Id: this.recordId,
                [name]: checked,
                Privacy_Preferences_Last_Updated__c: new Date().toISOString()
            };

            await updateRecord({ fields });
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Your preferences have been updated',
                    variant: 'success'
                })
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error updating preferences',
                message: error.body?.message || 'Unknown error',
                variant: 'error'
            })
        );
    }

    get formattedLastUpdate() {
        return this.lastUpdated 
            ? new Date(this.lastUpdated).toLocaleDateString()
            : 'Not yet updated';
    }
}