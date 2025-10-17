require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "POST /users" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          email_address: "newuser@example.com",
          password: "password123",
          password_confirmation: "password123"
        }
      end

      it "creates a new user and returns user data" do
        post "/users", params: valid_params

        expect(response).to have_http_status(:created)
        expect(response.content_type).to eq("application/json; charset=utf-8")

        json_response = JSON.parse(response.body)
        expect(json_response["id"]).to be_present
        expect(json_response["email_address"]).to eq("newuser@example.com")
        expect(json_response["created_at"]).to be_present
        expect(json_response["updated_at"]).to be_present
      end

      it "creates a new user record in the database" do
        expect {
          post "/users", params: valid_params
        }.to change(User, :count).by(1)

        user = User.last
        expect(user.email_address).to eq("newuser@example.com")
        expect(user.authenticate("password123")).to be_truthy
      end

      it "creates a session for the new user" do
        expect {
          post "/users", params: valid_params
        }.to change(Session, :count).by(1)

        session = Session.last
        user = User.last
        expect(session.user).to eq(user)
        expect(session.ip_address).to be_present
      end

      it "normalizes email address" do
        post "/users", params: valid_params.merge(email_address: "  NEWUSER@EXAMPLE.COM  ")

        user = User.last
        expect(user.email_address).to eq("newuser@example.com")
      end
    end

    context "with invalid parameters" do
      it "returns unprocessable entity with missing email" do
        post "/users", params: {
          password: "password123",
          password_confirmation: "password123"
        }

        expect(response).to have_http_status(:unprocessable_content)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Registration failed")
        expect(json_response["errors"]).to include("Email address can't be blank")
      end

      it "returns unprocessable entity with missing password" do
        post "/users", params: {
          email_address: "newuser@example.com"
        }

        expect(response).to have_http_status(:unprocessable_content)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Registration failed")
        expect(json_response["errors"]).to include("Password can't be blank")
      end

      it "returns unprocessable entity with mismatched password confirmation" do
        post "/users", params: {
          email_address: "newuser@example.com",
          password: "password123",
          password_confirmation: "different_password"
        }

        expect(response).to have_http_status(:unprocessable_content)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Registration failed")
        expect(json_response["errors"]).to include("Password confirmation doesn't match Password")
      end

      it "returns unprocessable entity with duplicate email" do
        create(:user, email_address: "existing@example.com")

        post "/users", params: {
          email_address: "existing@example.com",
          password: "password123",
          password_confirmation: "password123"
        }

        expect(response).to have_http_status(:unprocessable_content)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Registration failed")
        expect(json_response["errors"]).to include("Email address has already been taken")
      end

      it "returns unprocessable entity with invalid email format" do
        post "/users", params: {
          email_address: "invalid_email",
          password: "password123",
          password_confirmation: "password123"
        }

        expect(response).to have_http_status(:unprocessable_content)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Registration failed")
        expect(json_response["errors"]).to be_present
      end

      it "does not create a user record when validation fails" do
        expect {
          post "/users", params: {
            email_address: "invalid_email",
            password: "password123",
            password_confirmation: "password123"
          }
        }.not_to change(User, :count)
      end

      it "does not create a session when user creation fails" do
        expect {
          post "/users", params: {
            email_address: "", # Invalid email
            password: "password123",
            password_confirmation: "password123"
          }
        }.not_to change(Session, :count)
      end
    end

    context "with missing password confirmation" do
      it "still creates user if password is present" do
        post "/users", params: {
          email_address: "newuser@example.com",
          password: "password123"
        }

        expect(response).to have_http_status(:created)

        user = User.last
        expect(user.email_address).to eq("newuser@example.com")
        expect(user.authenticate("password123")).to be_truthy
      end
    end
  end

  describe "GET /me" do
    context "when authenticated" do
      let!(:user) { create(:user) }

      before do
        sign_in_as(user)
      end

      it "returns the current user data" do
        get "/me"

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to eq("application/json; charset=utf-8")

        json_response = JSON.parse(response.body)
        expect(json_response["id"]).to eq(user.id)
        expect(json_response["email_address"]).to eq(user.email_address)
        expect(json_response["created_at"]).to be_present
        expect(json_response["updated_at"]).to be_present
      end

      it "returns the correct user data for the authenticated user" do
        get "/me"

        json_response = JSON.parse(response.body)
        expect(json_response["email_address"]).to eq(user.email_address)
      end
    end

    context "when not authenticated" do
      it "returns unauthorized status" do
        get "/me"

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["message"]).to eq("Authentication required")
        expect(json_response["errors"]).to include("Please log in to access this resource")
      end
    end
  end
end
