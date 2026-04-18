import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Textarea,
} from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";

const demoRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone number"),
  date: z.date().refine(date => date > new Date(), "Please select a future date"),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters").max(500, "Purpose must be less than 500 characters"),
});

type DemoRequestFormData = z.infer<typeof demoRequestSchema>;

interface DemoRequestFormProps {
  onSuccess?: () => void;
}

const DemoRequestForm = ({ onSuccess }: DemoRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DemoRequestFormData>({
    resolver: zodResolver(demoRequestSchema),
  });

  const watchDate = watch("date");

  const onSubmit = async (data: DemoRequestFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const formattedDateTime = `${format(data.date, "MMM dd, yyyy")} at ${data.time}`;

      const payload = {
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        scheduledDateTime: formattedDateTime,
        purpose: data.purpose,
        submittedAt: new Date().toISOString(),
      };

      const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

      if (!scriptUrl || scriptUrl.includes("{DEPLOYMENT_ID}")) {
        setSubmitStatus("error");
        setErrorMessage("Form configuration is incomplete. Please contact support.");
        console.error("Google Apps Script URL not configured");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Note: With no-cors, we can't read the response, so we assume success
      setSubmitStatus("success");
      
      // Keep modal open for 5 seconds to show thank you message, then close
      if (onSuccess) {
        setTimeout(() => onSuccess(), 5000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {submitStatus === "success" ? (
        <motion.div
          className="rounded-2xl border border-accent/30 bg-accent/5 backdrop-blur-sm p-8 text-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
          <p className="text-2xl font-semibold text-white mb-3">Thank You for Submitting!</p>
          <p className="text-white/70 text-lg leading-relaxed">
            Our team will reach out to you shortly. We look forward to showing you how Binder OS can transform your manufacturing operations.
          </p>
          <p className="text-white/50 text-sm mt-6">This window will close automatically in a few seconds...</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name and Company Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-accent focus:border-transparent transition-all backdrop-blur-sm"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white text-sm font-medium">
                Company Name *
              </Label>
              <Input
                id="companyName"
                placeholder="Your Company Ltd"
                {...register("companyName")}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-accent focus:border-transparent transition-all backdrop-blur-sm"
              />
              {errors.companyName && (
                <p className="text-red-400 text-xs mt-1">{errors.companyName.message}</p>
              )}
            </div>
          </div>

          {/* Email and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-accent focus:border-transparent transition-all backdrop-blur-sm"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-accent focus:border-transparent transition-all backdrop-blur-sm"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-white text-sm font-medium">Preferred Date *</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/10">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white text-sm font-medium">
                Preferred Time *
              </Label>
              <Input
                id="time"
                type="time"
                {...register("time")}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all backdrop-blur-sm"
              />
              {errors.time && (
                <p className="text-red-400 text-xs mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-white text-sm font-medium">
              What's Your Main Purpose? *
            </Label>
            <Textarea
              id="purpose"
              placeholder="Tell us about your manufacturing needs and what challenges you're looking to solve with Binder OS..."
              {...register("purpose")}
              className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-accent focus:border-transparent transition-all backdrop-blur-sm min-h-[120px] resize-none"
            />
            <p className="text-white/40 text-xs">
              {watch("purpose")?.length || 0}/500 characters
            </p>
            {errors.purpose && (
              <p className="text-red-400 text-xs mt-1">{errors.purpose.message}</p>
            )}
          </div>

          {/* Error Message */}
          {submitStatus === "error" && (
            <motion.div
              className="rounded-lg border border-red-400/30 bg-red-50/5 p-4 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{errorMessage}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent px-6 py-3 font-bold text-accent-foreground text-base shadow-lg shadow-accent/30 hover:shadow-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">
              {isSubmitting ? "Submitting..." : "Request Demo"}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"
            />
          </motion.button>

          {/* Privacy Note */}
          <p className="text-white/40 text-xs text-center">
            We respect your privacy. Your information will only be used to schedule your demo.
          </p>
        </form>
      )}
    </motion.div>
  );
};

export default DemoRequestForm;
