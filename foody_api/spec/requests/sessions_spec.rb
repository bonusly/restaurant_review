require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  let(:user) { create(:user, email_address: "test@example.com", password: "password123") }

  describe "POST /session" do
    context "with valid credentials" do
      it "returns the user data with success status" do
        post "/session", params: {
          email_address: user.email_address,
          password: "password123"
        }

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to eq("application/json; charset=utf-8")

        json_response = JSON.parse(response.body)
        expect(json_response["id"]).to eq(user.id)
        expect(json_response["email_address"]).to eq(user.email_address)
        expect(json_response["created_at"]).to be_present
        expect(json_response["updated_at"]).to be_present
      end

      it "creates a new session record" do
        expect {
          post "/session", params: {
            email_address: user.email_address,
            password: "password123"
          }
        }.to change(Session, :count).by(1)

        session = Session.last
        expect(session.user).to eq(user)
        expect(session.ip_address).to be_present
      end
    end

    context "with invalid credentials" do
      it "returns unauthorized with wrong password" do
        post "/session", params: {
          email_address: user.email_address,
          password: "wrongpassword"
        }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Authentication failed")
        expect(json_response["errors"]).to include("Invalid email address or password")
      end

      it "returns unauthorized with wrong email" do
        post "/session", params: {
          email_address: "wrong@example.com",
          password: "password123"
        }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Authentication failed")
        expect(json_response["errors"]).to include("Invalid email address or password")
      end

      it "does not create a session record" do
        expect {
          post "/session", params: {
            email_address: user.email_address,
            password: "wrongpassword"
          }
        }.not_to change(Session, :count)
      end
    end

    context "with missing parameters" do
      it "returns unauthorized when email is missing" do
        post "/session", params: {
          password: "password123"
        }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Authentication failed")
        expect(json_response["errors"]).to include("Invalid email address or password")
      end

      it "returns unauthorized when password is missing" do
        post "/session", params: {
          email_address: user.email_address
        }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Authentication failed")
        expect(json_response["errors"]).to include("Invalid email address or password")
      end
    end
  end

  describe "DELETE /session" do
    context "when authenticated" do
      before do
        sign_in_as(user)
      end

      it "returns no content status" do
        delete "/session"

        expect(response).to have_http_status(:no_content)
        expect(response.body).to be_empty
      end

      it "destroys the session record" do
        expect {
          delete "/session"
        }.to change(Session, :count).by(-1)
      end
    end

    context "when not authenticated" do
      it "returns unauthorized status" do
        delete "/session"

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Authentication required")
        expect(json_response["errors"]).to include("Please log in to access this resource")
      end

      it "does not destroy any session records" do
        expect {
          delete "/session"
        }.not_to change(Session, :count)
      end
    end
  end
end
