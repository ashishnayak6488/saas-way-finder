"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/Dialog";

const CalandarPage = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDuration, setEventDuration] = useState("day");
  console.log(currentEvents, isDialogOpen, newEventTitle, selectedDate, eventDuration)

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setCurrentEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(currentEvents));
  }, [currentEvents]);

  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected) => {
    if (
      alert(
        `Are you sure you want to delete the event "${selected.event.title}"?`
      )
    ) {
      selected.event.remove();
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
    setEventDuration("day"); // Reset duration when closing the dialog
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      let newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      // Adjust event based on selected duration
      if (eventDuration === "week") {
        newEvent.start = selectedDate.start;
        newEvent.end = new Date(selectedDate.start);
        newEvent.end.setDate(selectedDate.start.getDate() + 7);
      } else if (eventDuration === "month") {
        newEvent.start = selectedDate.start;
        newEvent.end = new Date(selectedDate.start);
        newEvent.end.setMonth(selectedDate.start.getMonth() + 1);
      }

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <div>
      <div className="flex w-full px-10 justify-start items-start gap-8">
        {/* Sidebar */}
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">Calendar Events</div>
          <ul className="space-y-4">
            {currentEvents.length === 0 && (
              <div className="italic text-center text-gray-400">
                No Events Present
              </div>
            )}

            {currentEvents.map((event) => (
              <li
                className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                key={event.id}
              >
                {event.title}
                <br />
                <span className="text-slate-950">
                  {new Date(event.start).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Calendar */}
        <div className="w-9/12 mt-8">
          <FullCalendar
            height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={currentEvents}
          />
        </div>
      </div>


      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event Details</DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              required
              className="border border-gray-200 p-3 rounded-md text-lg"
            />
            <div className="mt-4">
              <label className="text-lg">Event Duration</label>
              <div className="flex items-center gap-4 mt-2">
                <label>
                  <input
                    type="radio"
                    value="day"
                    checked={eventDuration === "day"}
                    onChange={() => setEventDuration("day")}
                  />
                  <span className="ml-2">Single Day</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="week"
                    checked={eventDuration === "week"}
                    onChange={() => setEventDuration("week")}
                  />
                  <span className="ml-2">Whole Week</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="month"
                    checked={eventDuration === "month"}
                    onChange={() => setEventDuration("month")}
                  />
                  <span className="ml-2">Whole Month</span>
                </label>
              </div>
            </div>
            <button
              className="bg-orange-500 text-white p-2 mt-5 rounded-md"
              type="submit"
            >
              Add
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalandarPage;