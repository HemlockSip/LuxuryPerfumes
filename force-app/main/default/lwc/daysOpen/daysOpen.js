// daysOpen.js
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CREATED_DATE_FIELD from '@salesforce/schema/Case.CreatedDate';
import CLOSED_DATE_FIELD from '@salesforce/schema/Case.ClosedDate';
import STATUS_FIELD from '@salesforce/schema/Case.Status';

export default class DaysOpen extends LightningElement {
    @api recordId;
    daysOpen = 0;
    isLoading = true;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [CREATED_DATE_FIELD, CLOSED_DATE_FIELD, STATUS_FIELD]
    })
    wiredCase({ error, data }) {
        if (data) {
            this.calculateDaysOpen(data);
            this.isLoading = false;
        } else if (error) {
            console.error('Error loading case:', error);
            this.isLoading = false;
        }
    }

    calculateDaysOpen(caseRecord) {
        const createdDate = new Date(getFieldValue(caseRecord, CREATED_DATE_FIELD));
        const status = getFieldValue(caseRecord, STATUS_FIELD);
        const closedDate = getFieldValue(caseRecord, CLOSED_DATE_FIELD);
        
        const endDate = status === 'Closed' ? new Date(closedDate) : new Date();
        
        // Calculate difference in milliseconds
        const diffTime = Math.abs(endDate - createdDate);
        // Convert to days
        this.daysOpen = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    get daysOpenLabel() {
        return this.daysOpen === 1 ? 'Day Open' : 'Days Open';
    }

    get containerClass() {
        return `slds-box slds-p-around_medium slds-theme_default ${this.getDaysOpenSeverityClass()}`;
    }

    getDaysOpenSeverityClass() {
        if (this.daysOpen <= 2) return 'slds-theme_success';
        if (this.daysOpen <= 5) return 'slds-theme_warning';
        return 'slds-theme_error';
    }
}