import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import prisma from "../src/shared/lib/prisma";

interface ExamRecord {
  Date: string;
  "Start Time": string;
  "End Time": string;
  Code: string;
  Subject_en: string;
  Subject_th: string;
  Credits: string;
  Note: string;
  Section: string;
  Section_Type_th: string;
  Section_Type_en: string;
  Building: string;
  Room: string;
  Instructor_th: string;
  Instructor_en: string;
  Proctor: string;
}

async function main() {
  const csvFile = path.join(__dirname, "data", "exam_table.csv");
  const fileContent = fs.readFileSync(csvFile, "utf-8");

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as ExamRecord[];

  let count = 0;
  for (const record of records) {
    const courseId = record["Code"];
    const section = record["Section"];

    await prisma.course.upsert({
      where: { id: courseId },
      update: {
        titleTh: record["Subject_th"],
        titleEn: record["Subject_en"],
      },
      create: {
        id: courseId,
        titleTh: record["Subject_th"] || "",
        titleEn: record["Subject_en"],
      },
    });

    const offering = await prisma.courseOffering.upsert({
      where: {
        courseId_section: {
          courseId: courseId,
          section: section,
        },
      },
      update: {
        instructorTh: record["Instructor_th"],
        instructorEn: record["Instructor_en"],
        sectionType: record["Section_Type_en"],
        credits: parseFloat(record["Credits"]) || 0,
      },
      create: {
        courseId: courseId,
        section: section,
        instructorTh: record["Instructor_th"],
        instructorEn: record["Instructor_en"],
        sectionType: record["Section_Type_en"],
        credits: parseFloat(record["Credits"]) || 0,
      },
    });

    const dateStr = record["Date"];
    const startTimeStr = record["Start Time"].padStart(5, "0");
    const endTimeStr = record["End Time"].padStart(5, "0");

    let examDate: Date;
    if (dateStr.includes("-")) {
      examDate = new Date(`${dateStr}T00:00:00Z`);
    } else {
      const [day, month, year] = dateStr.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      examDate = new Date(`${formattedDate}T00:00:00Z`);
    }

    const isoDatePart = examDate.toISOString().split("T")[0];
    const startTime = new Date(`${isoDatePart}T${startTimeStr}:00Z`);
    const endTime = new Date(`${isoDatePart}T${endTimeStr}:00Z`);

    await prisma.exam.create({
      data: {
        offeringId: offering.id,
        examType: "final",
        examDate: examDate,
        startTime: startTime,
        endTime: endTime,
        building: record["Building"],
        room: record["Room"],
        note: record["Note"],
        proctor: record["Proctor"],
      },
    });

    count++;
    if (count % 100 === 0) {
      console.log(`Processed ${count} records`);
    }
  }

  console.log(`Seeding completed! Total ${count} exams created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
