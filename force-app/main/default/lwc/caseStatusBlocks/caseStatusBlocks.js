// caseStatusBlocks.js
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CREATED_DATE_FIELD from '@salesforce/schema/Case.CreatedDate';
import CLOSED_DATE_FIELD from '@salesforce/schema/Case.ClosedDate';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import IS_ESCALATED_FIELD from '@salesforce/schema/Case.IsEscalated';

const FIELDS = [
    CREATED_DATE_FIELD,
    CLOSED_DATE_FIELD,
    STATUS_FIELD,
    IS_ESCALATED_FIELD
];

export default class CaseStatusBlocks extends LightningElement {
    @api recordId;
    daysOpen = 0;
    caseStatus;
    isEscalated;
    isLoading = true;
    error;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: FIELDS
    })
    wiredCase({ error, data }) {
        if (data) {
            this.processData(data);
            this.isLoading = false;
        } else if (error) {
            this.error = error;
            this.isLoading = false;
        }
    }

    processData(caseRecord) {
        // Calculate days open
        const createdDate = new Date(getFieldValue(caseRecord, CREATED_DATE_FIELD));
        this.caseStatus = getFieldValue(caseRecord, STATUS_FIELD);
        const closedDate = getFieldValue(caseRecord, CLOSED_DATE_FIELD);
        
        const endDate = this.caseStatus === 'Closed' ? new Date(closedDate) : new Date();
        const diffTime = Math.abs(endDate - createdDate);
        this.daysOpen = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Get escalation status
        this.isEscalated = getFieldValue(caseRecord, IS_ESCALATED_FIELD);
    }

    get daysOpenLabel() {
        return this.daysOpen === 1 ? 'Day Open' : 'Days Open';
    }

    get daysOpenClass() {
        let baseClass = 'status-block days-open ';
        if (this.daysOpen <= 2) return baseClass + 'slds-theme_success';
        if (this.daysOpen <= 5) return baseClass + 'slds-theme_warning';
        return baseClass + 'slds-theme_error';
    }

    get statusClass() {
        let baseClass = 'status-block case-status ';
        switch (this.caseStatus) {
            case 'New':
                return baseClass + 'slds-theme_info';
            case 'Working':
                return baseClass + 'slds-theme_warning';
            case 'Closed':
                return baseClass + 'slds-theme_success';
            default:
                return baseClass + 'slds-theme_default';
        }
    }

    get escalatedClass() {
        let baseClass = 'status-block escalation ';
        return baseClass + (this.isEscalated ? 'slds-theme_error' : 'slds-theme_success');
    }

    get escalatedIcon() {
        return this.isEscalated ? 'utility:priority' : 'utility:check';
    }

    get escalatedText() {
        return this.isEscalated ? 'Escalated' : 'Not Escalated';
    }
}