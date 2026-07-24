"use client";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import {
  Alert,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container } from "@/components/container";

type ContactFormValues = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(\+880|880|0)?1[3-9]\d{8}$/;

const CONTACT_CHANNELS = [
  {
    icon: LocationOnOutlinedIcon,
    label: "Visit",
    value: "Dhaka, Bangladesh",
    href: undefined,
  },
  {
    icon: EmailOutlinedIcon,
    label: "Email",
    value: "hello@ecofashion.com",
    href: "mailto:hello@ecofashion.com",
  },
  {
    icon: PhoneOutlinedIcon,
    label: "Phone",
    value: "+880 1700-000000",
    href: "tel:+8801700000000",
  },
  {
    icon: ScheduleOutlinedIcon,
    label: "Hours",
    value: "Sat–Thu, 10:00–19:00",
    href: undefined,
  },
] as const;

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    mode: "onBlur",
  });

  function onSubmit(_values: ContactFormValues) {
    setSubmitted(true);
    reset();
    window.setTimeout(() => setSubmitted(false), 3500);
  }

  return (
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6 md:-mt-10 md:-mb-10 lg:-mx-8">
      <section className="relative isolate min-h-[58vh] overflow-hidden sm:min-h-[62vh]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=2000&q=80"
            alt="Menswear styling and accessories"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#14221f]/90 via-[#14221f]/60 to-[#14221f]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14221f]/45 via-transparent to-transparent" />

        <Container className="relative flex min-h-[58vh] flex-col justify-end pb-12 pt-28 sm:min-h-[62vh] sm:pb-16 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="max-w-2xl"
          >
            <p className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
              Eco Fashion
            </p>
            <h1 className="mt-4 max-w-xl text-xl font-semibold tracking-[-0.02em] text-white/95 sm:text-2xl md:text-3xl">
              We&apos;re here to help.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
              Sizing questions, order updates, or styling advice — reach out and
              our team will get back to you promptly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:hello@ecofashion.com"
                className="inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#20312d] transition-colors hover:bg-[#f6f3ed]"
              >
                Email us
              </a>
              <a
                href="tel:+8801700000000"
                className="inline-flex items-center rounded-md border border-white/35 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
              >
                Call support
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-[#f6f3ed]">
        <Container className="grid gap-12 py-14 md:grid-cols-12 md:gap-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="md:col-span-5"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-[#1f6f5b] uppercase">
              Contact details
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#20312d] sm:text-3xl">
              Talk to Eco Fashion.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#61716a] sm:text-base">
              Prefer a direct line? Use the channels below, or send a message —
              we usually reply within one business day.
            </p>

            <ul className="mt-10 space-y-6">
              {CONTACT_CHANNELS.map((item) => (
                <li key={item.label} className="flex gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[rgba(31,111,91,0.1)] text-[#1f6f5b]">
                    <item.icon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-[#61716a] uppercase">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1 inline-block text-sm font-medium text-[#20312d] transition-colors hover:text-[#1f6f5b] sm:text-base"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-[#20312d] sm:text-base">
                        {item.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-10 text-sm text-[#61716a]">
              Looking for returns or delivery info?{" "}
              <Link
                href="/about"
                className="font-semibold text-[#1f6f5b] transition-colors hover:text-[#185a4a]"
              >
                Learn about Eco Fashion
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="md:col-span-7"
          >
            <div className="rounded-md border border-[rgba(32,49,45,0.1)] bg-[#fffdf8] p-5 sm:p-8">
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#20312d" }}>
                Send a message
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 0.75, color: "#61716a", mb: 3 }}
              >
                Tell us what you need — orders, sizing, or general questions.
              </Typography>

              {submitted ? (
                <Alert severity="success" sx={{ mb: 2, borderRadius: "6px" }}>
                  Message sent. We&apos;ll get back to you soon.
                </Alert>
              ) : null}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2.25}>
                  <TextField
                    label="Full name"
                    fullWidth
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName?.message}
                    {...register("fullName", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Enter at least 2 characters",
                      },
                    })}
                  />

                  <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: EMAIL_PATTERN,
                          message: "Enter a valid email",
                        },
                      })}
                    />
                    <TextField
                      label="Phone (optional)"
                      fullWidth
                      error={Boolean(errors.phone)}
                      helperText={errors.phone?.message}
                      {...register("phone", {
                        validate: (value) =>
                          !value ||
                          PHONE_PATTERN.test(value.replace(/[\s-]/g, "")) ||
                          "Use a valid BD mobile number",
                      })}
                    />
                  </div>

                  <TextField
                    label="Subject"
                    fullWidth
                    error={Boolean(errors.subject)}
                    helperText={errors.subject?.message}
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: {
                        value: 3,
                        message: "Enter a short subject",
                      },
                    })}
                  />

                  <TextField
                    label="Message"
                    fullWidth
                    multiline
                    minRows={5}
                    error={Boolean(errors.message)}
                    helperText={errors.message?.message}
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Please write at least 10 characters",
                      },
                    })}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      alignSelf: "flex-start",
                      px: 3.5,
                      py: 1.25,
                      bgcolor: "#1f6f5b",
                      "&:hover": { bgcolor: "#185a4a" },
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </Button>
                </Stack>
              </form>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
