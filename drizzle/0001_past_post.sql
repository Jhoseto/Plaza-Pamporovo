CREATE TABLE `apartments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`sqm` int,
	`bedrooms` int,
	`pricePerNight` int,
	`minNights` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apartments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blockedDates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`apartmentId` int NOT NULL,
	`date` timestamp NOT NULL,
	`reason` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blockedDates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`apartmentId` int NOT NULL,
	`guestName` varchar(255) NOT NULL,
	`guestEmail` varchar(320) NOT NULL,
	`guestPhone` varchar(20),
	`checkInDate` timestamp NOT NULL,
	`checkOutDate` timestamp NOT NULL,
	`numberOfNights` int NOT NULL,
	`totalPrice` int,
	`status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
	`specialRequests` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservations_id` PRIMARY KEY(`id`)
);
