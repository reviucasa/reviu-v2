"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useTranslations } from "next-intl";

export default function SuspendedPage() {
  const t = useTranslations();
  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <div>
          <h2 className="mb-10">Your Account Has Been Suspended</h2>
          <div className="flex flex-col gap-3 mb-10">
            <h5 className="my-2 font-extrabold">
              Why Was My Account Suspended?
            </h5>
            <p>
              We have sent you an email detailing the reasons for the suspension
              of your account. Below are the most common reasons for account
              suspensions:
            </p>
            <ol className="ml-8 space-y-2" style={{ listStyleType: "circle" }}>
              <li>Engagement in hate speech or discriminatory behavior</li>
              <li>Posting of fake reviews or misleading information</li>
              <li>
                Repeated posting of unwanted or repetitive content to disrupt
                the user experience.
              </li>
              <li>
                Maliciously reporting content or other users without just cause.
              </li>
              <li>
                Posing as another individual or organization to deceive users.
              </li>
              <li>
                Encouraging or facilitating illegal activities through the
                platform.
              </li>
              <li>
                Unauthorized sharing or publication of private information.
              </li>
            </ol>

            <p>
              While your account is suspended, you will not be able to access
              certain features and pages of our platform. Please note that
              unless the decision is overturned, all data associated with your
              account will be permanently deleted within 30 days.
            </p>
          </div>
          <div className="flex flex-col gap-3 mb-10">
            <h5 className="my-2 font-extrabold">Believe This is a Mistake?</h5>
            <p>
              Our decisions to suspend accounts involve careful review and are
              supported by a combination of AI tools and human oversight. If you
              believe your account was wrongly suspended, or if there are
              extenuating circumstances we should consider, please contact us
              directly at{" "}
              <a
                href="mailto:info@reviucasa.com"
                className="text-blue-400 underline"
              >
                info@reviucasa.com
              </a>
              .
            </p>
            <p>
              We are committed to ensuring fairness and will review your case as
              quickly as possible.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
