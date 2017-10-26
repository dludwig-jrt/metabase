import React, { Component } from "react";
import Button from "metabase/components/Button";
import SchedulePicker from "metabase/components/SchedulePicker";
import { connect } from "react-redux";
import { createAlert, updateAlert } from "metabase/query_builder/actions";
import ModalContent from "metabase/components/ModalContent";

@connect(null, { createAlert })
export class CreateAlertModalContent extends Component {
    // contains the first-time educational screen
    // ModalContent, parent uses ModalWithTrigger
    props: {
        onClose: boolean
    }

    state = {
        hasSeenEducationalScreen: false
    }

    onCreateAlert = async (alert) => {
        const { createAlert, onClose } = this.props
        await createAlert(alert)
        // should close be triggered manually like this
        // but the creation notification would appear automatically ...?
        // OR should the modal visibility be part of QB redux state
        // (maybe check how other modals are implemented)
        onClose()
    }

    proceedFromEducationalScreen = () => {
        // TODO: how to save that educational screen has been seen? Should come from Redux state
        this.setState({ hasSeenEducationalScreen: true })
    }

    render() {
        const { onClose } = this.props

        if (!this.state.hasSeenEducationalScreen) {
            return <AlertEducationalScreen onProceed={this.proceedFromEducationalScreen} />
        }

        return (
            <ModalContent
                title={<AlertModalTitle text="Let's set up your alert" />}
                onClose={onClose}
            >
                <AlertEditForm onDone={this.onCreateAlert} />
                <Button onClick={onClose}>Cancel</Button>
                <Button primary onClick={this.onCreateAlert}>Done</Button>
            </ModalContent>
        )
    }
}

export class AlertEducationalScreen extends Component {
    props: {
        onProceed: () => void
    }

    render() {
        const { onProceed } = this.props;

        return (
            <div className="pt2 ml-auto mr-auto">
                <h3>The wide world of alerts</h3>
                <p>There are a few different kinds of alerts you can get</p>
                <p>[ the educational image comes here ]</p>
                <Button primary onClick={onProceed}>Set up an alert</Button>
            </div>
        )
    }
}

@connect(null, { updateAlert })
export class UpdateAlertModalContent extends Component {
    props: {
        onClose: boolean
    }
    // contains the deletion button
    // ModalContent, parent uses ModalWithTrigger

    onUpdateAlert(alert) {
        const { updateAlert, onClose } = this.props

        updateAlert(alert)
        onClose()
    }

    render() {
        const { onClose } = this.props

        return (
            <ModalContent
                title={<AlertModalTitle text="Edit your alert" />}
                onClose={onClose}
            >
                <AlertEditForm onDone={this.onCreateAlert} />
                <Button onClick={onClose}>Cancel</Button>
                <Button primary onClick={this.onUpdateAlert}>Save changes</Button>
            </ModalContent>
        )
    }
}

const AlertModalTitle = ({ text }) =>
    <div>
        <p>[edit alert icon comes here]</p>
        { text }
    </div>

export class AlertEditForm extends Component {
    // contains the schedule selector and if admin, then email/slack options

    state = {
        schedule: {
            schedule_day: "mon",
            schedule_frame: null,
            schedule_hour: 0,
            schedule_type: "daily"
        }
    }

    setSchedule = (schedule) => {
        this.setState({ schedule })
    }

    render() {
        const { schedule } = this.state;

        return (
            <div>
                <h3>How often should we check?</h3>
                <p>By default, we’ll check this question for results at the start of every day, at 12:00 AM.</p>
                <SchedulePicker
                    schedule={schedule}
                    scheduleOptions={["hourly", "daily"]}
                    onScheduleChange={this.setSchedule}
                    textBeforeInterval="Scan"
                />
            </div>
        )
    }
}

