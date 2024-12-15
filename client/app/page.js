import { Button } from "./components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    name: "AI-based Day Planning",
    description:
      "Get smart recommendations for your daily tasks based on your goals and preferences.",
    icon: GlobeIcon,
  },
  {
    name: "Creative UI for Task Management",
    description:
      "A sleek, easy-to-use interface that makes managing your day and projects a breeze.",
    icon: ZapIcon,
  },
  {
    name: "Project Management Tools",
    description:
      "Organize and track your projects with customizable task lists, due dates, and reminders.",
    icon: BrainCogIcon,
  },
  {
    name: "Pomodoro Timer",
    description:
      "Boost productivity with the Pomodoro technique—focus on tasks with timed intervals.",
    icon: EyeIcon,
  },
  {
    name: "Task Prioritization",
    description:
      "Prioritize your tasks based on deadlines, importance, and personal preferences.",
    icon: ServerCogIcon,
  },
  {
    name: "Cross-Device Syncing",
    description:
      "Access your task lists and projects from any device—stay on top of your tasks wherever you are.",
    icon: MonitorSmartphoneIcon,
  },
];

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600 ml-[100px]">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-6">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your Personal Productivity Assistant
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Manage Your Day, Achieve Your Goals
            </p>
            <p className="mt-6 text-lg leading-6 text-gray-600">
              Introducing{" "}
              <span className="font-bold text-indigo-600">Productivity App</span>
              <br />
              <br />
              Our AI-powered platform helps you plan your day, stay focused, and manage tasks
              effectively. Whether it’s creating your to-do list, managing projects, or using
              the Pomodoro technique to stay productive, <span className="text-indigo-600">Productivity App</span>
              enhances your workflow with dynamic tools that keep you on track, all in one place.
            </p>
          </div>
          <Button asChild className="mt-10">
            <Link href="/flow">Get Started</Link>
          </Button>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              alt="App screenshot"
              src="/hehe.png"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div aria-hidden="true" className="relative">
              <div
                className="absolute bottom-0 -inset-x-32
             bg-gradient-to-t from-white/95 pt-[5%]"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-0 lg:gap-y-16">
            {features.map((feature) => (
              <div className="relative pl-9" key={feature.name}>
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon
                    aria-hidden="true"
                    className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                  />
                </dt>
                <dd>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
