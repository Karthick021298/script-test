'use-client'
import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import BotApi from '@/service/BotApi'
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
	input: {
		fontFamily: 'Poppins, sans-serif',
		borderRadius: '5px',
		border: '1px solid #ccc',
		boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
		padding: '8px',
		outline: 'none',
		boxSizing: 'border-box',
	},
	inputFocused: {
		borderColor: 'dodgerblue',
	},
}))

const DateSelection = (props) => {
	const {
		setMessages,
		bookModes,
		availSlot,
		setAvailslot,
		defaultTentuser,
		domainData,
		setCurrentState,
		selectedDate,
		setSelectedDate,
		setLoading,
		selectedUser,
		userData,
		setUserData,
		apptDetails,
		params,
		setParams,
		messages,
		index,
		data,
	} = props
	const classes = useStyles()
	const onChange = (event) => {
		setLoading(false)
		if (userData?.endpoint === 'reschedule_appointment') {
			setMessages((prevMessages) => [
				...prevMessages,
				{
					name: 'ChosenDate',
					type: 'cust',
					jsonType: 'card',
					component: '',
					data: {
						message: moment(event.target.value, 'YYYY-MM-DD').format('DD MMM YYYY'),
					},
				},
				{
					name: 'TimeSlotView',
					type: 'bot',
					jsonType: 'card',
					component: '',
					data: {
						message: 'Select your slot',
					},
				},
				{
					name: 'SlotSelection',
					disabled: false,
					type: 'bot',
					jsonType: 'NonCard',
					component: availSlot,
					data: {},
				},
			])
		} else
			setMessages((prevMessages) => [
				...prevMessages,
				{
					name: 'ChosenDate',
					type: 'cust',
					jsonType: 'card',
					component: '',
					data: {
						message: moment(event.target.value, 'YYYY-MM-DD').format('DD MMM YYYY'),
					},
				},
				{
					name: 'Choose branch',
					type: 'bot',
					jsonType: 'card',
					component: '',
					data: {
						message: 'Choose the mode of appointment',
					},
				},
				{
					name: 'actions',
					type: 'bot',
					jsonType: '',
					disabled: false,
					component: '',
					data: _.map(selectedUser?.appointmentMode, (item) => {
						return {
							actionName: item,
							id: _.isEqual(item, 'In-person') ? 'inperson' : _.isEqual(item, 'Home') ? 'home' : 'online',
							onPress: () => {
								setParams({
									tentId: domainData?.mastTentUuid,
									appointmentMode: _.isEqual(item, 'In-person') ? 'at-clinic' : _.isEqual(item, 'Home') ? 'at-home' : 'on-line',
									tentUserId: selectedUser?.tentUserDTO?.tentUserUuid,
									scheduledOn: moment(event.target.value, 'YYYY-MM-DD').format('YYYY-MM-DD'),
								})
								setCurrentState((prevState) => [
									{
										...prevState[0],
										ChooseChatOption: {
											...prevState[0]?.ChooseChatOption,
											modeSelected: true,
										},
									},
								])
							},
						}
					}),
				},
			])
	}
	const handleDateChange = useCallback(
		(event) => {
			setLoading(true)
			let newArr = _.map(messages, (item, idx) => {
				return idx === index ? { ...item, disabled: true } : item
			})
			setMessages(newArr)
			const onSuccess = (res) => {
				if (res?.data?.status === 'success') {
					setLoading(false)
					const availableslot = res?.data?.data
					if (!_.isEmpty(availableslot)) {
						setAvailslot(availableslot)
						onChange(event)
					} else {
						let newArr = _.map(messages, (item, idx) => {
							return idx === index ? { ...item, disabled: false } : item
						})
						setMessages(newArr)
						setAvailslot([])
						setMessages((prevMessages) => [
							...prevMessages,
							{
								name: 'ChosenDate',
								type: 'cust',
								jsonType: 'card',
								component: '',
								data: {
									message: event.target.value,
								},
							},
							{
								name: 'TimeSlotView',
								type: 'bot',
								jsonType: 'card',
								component: '',
								data: {
									message: `Slot's not available on the date ${event.target.value} please choose other`,
								},
							},
							{
								name: 'DateSelection',
								type: 'bot',
								jsonType: 'NonCard',
								component: '',
								data: {},
							},
						])
					}
				}
			}
			const onFailure = (err) => {
				let newArr = _.map(messages, (item, idx) => {
					return idx === index ? { ...item, disabled: false } : item
				})
				setMessages(newArr)
				setMessages((prevMessages) => [
					...prevMessages,
					{
						name: 'ChosenDate',
						type: 'bot',
						jsonType: 'card',
						component: '',
						data: {
							message: 'Sorry for the inconvenience! Please choose date again',
						},
					},
					{
						name: 'DateSelection',
						type: 'bot',
						jsonType: 'NonCard',
						component: '',
						data: {},
					},
				])
			}
			if (userData?.endpoint === 'reschedule_appointment') {
				BotApi.getSlot({
					tentId: domainData?.mastTentUuid,
					appointmentMode: _.isEqual(userData?.mode, 'In-person')
						? 'at-clinic'
						: _.isEqual(userData?.mode, 'Online')
						? 'on-line'
						: _.isEqual(userData?.mode, 'Home')
						? 'at-home'
						: bookModes,
					scheduledOn: userData?.date ? moment(userData?.date, 'YYYY-MM-DD').format('MM-DD-YYYY') : null || event.target?.value,
					tentUserId: userData?.tent_user_uuid || apptDetails?.tentUserUuid || defaultTentuser?.tentUserDTO?.tentUserUuid,
				}).then(onSuccess, onFailure)
			} else {
				onChange(event)
			}
		},
		[availSlot, bookModes, defaultTentuser, domainData?.mastTentUuid, setAvailslot, setMessages, userData, apptDetails]
	)

	const allowedDate = moment().subtract(1, 'day').format('YYYY-MM-DD')
	return (
		<div style={{ marginLeft: 30 }}>
			<input
				type='date'
				id='dateselector'
				name='date'
				min={new Date().toISOString().split('T')[0]}
				// max='9999-12-31'
				readOnly={data?.disabled}
				placeholder='DD-MM-YYYY'
				value={selectedDate}
				style={{ height: 40, borderRadius: 10 }}
				onChange={(e) => {
					setSelectedDate(e.target.value)
					if (moment(e?.target?.value).isAfter(allowedDate)) {
						handleDateChange(e)
					}
				}}
				className={classes.input}
				onFocus={(e) => e.target.classList.add(classes.inputFocused)}
				onBlur={(e) => e.target.classList.remove(classes.inputFocused)}
			/>
		</div>
	)
}

export default DateSelection
